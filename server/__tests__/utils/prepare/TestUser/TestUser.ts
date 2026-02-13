import { type Socket, io as ioClient } from 'socket.io-client'
import request from 'supertest'
import type TestAgent from 'supertest/lib/agent'
import type { LoginResponse, LogoutResponse } from '../../../../src/routes'
import type { MeResponse } from '../../../../src/routes/protected/controllers'
import type { HealthResponse } from '../../../../src/routes/public/controllers'
import type { ICredentials } from '../../../types/ICredentials'
import type { SuperResponse } from '../../types'

class TestUser {
  readonly #agent: TestAgent
  #token?: string | undefined
  #credentials: ICredentials
  #socket?: Socket
  #url: string

  constructor(url: string, credentials?: ICredentials) {
    this.#url = url
    this.#agent = request.agent(url).set('Accept', 'application/json')
    this.#credentials = credentials ?? { username: 'alice', password: 'secret' }
  }

  async login(): Promise<SuperResponse<LoginResponse>> {
    const res = (await this.agent
      .post('/auth/login')
      .send(this.credentials)) as unknown as SuperResponse<LoginResponse>

    if (res.body.success) this.token = res.body.data.auth.token

    return res
  }

  async logout(): Promise<SuperResponse<LogoutResponse>> {
    return this.agent.post('/auth/logout').set('Authorization', this.bearer)
  }

  me(): Promise<SuperResponse<MeResponse>> {
    return this.agent
      .get('/protected/me')
      .set('Authorization', this.bearer) as unknown as Promise<
      SuperResponse<MeResponse>
    >
  }

  health(): Promise<SuperResponse<HealthResponse>> {
    return this.agent.get('/public/health') as unknown as Promise<
      SuperResponse<HealthResponse>
    >
  }

  protectedSocket(): Promise<Socket> {
    return new Promise((resolve, reject) => {
      const socket = ioClient(`${this.url}/protected`, {
        transports: ['websocket'],
        auth: { token: this.token },
      })

      socket.once('connect', () => {
        this.#socket = socket
        resolve(socket)
      })

      socket.once('connect_error', err => {
        socket.close()
        reject(err)
      })
    })
  }

  publicSocket(): Promise<Socket> {
    return new Promise((resolve, reject) => {
      const socket = ioClient(`${this.url}/public`, {
        transports: ['websocket'],
      })

      socket.once('connect', () => resolve(socket))
      socket.once('connect_error', reject)
    })
  }

  disconnectSocket() {
    this.#socket?.disconnect()
    this.#socket = undefined
  }

  get data() {
    return this.me().then(meRes => {
      if (meRes.body.success) return meRes.body.data
      throw new Error(
        `/me rejected\n\tcode: ${meRes.statusCode},\n\t message ${meRes.body.message}`,
        { cause: meRes }
      )
    })
  }

  get bearer() {
    return `Bearer ${this.token}`
  }

  get agent() {
    return this.#agent
  }

  set token(newToken: string | undefined) {
    this.#token = newToken
  }

  get token() {
    return this.#token
  }

  get url() {
    return this.#url
  }

  private set url(url: string) {
    this.#url = url
  }

  get credentials() {
    return this.#credentials
  }

  private set credentials(newCredentials: ICredentials) {
    this.#credentials = newCredentials
  }
}

export { TestUser }
export type { SuperResponse }
