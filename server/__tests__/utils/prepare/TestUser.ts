import { type Socket, io as ioClient } from 'socket.io-client'
import request, { type Response } from 'supertest'
import type TestAgent from 'supertest/lib/agent'
import type { IApiFailure } from '../../../src/models'
import type { APIMeSuccess } from '../../../src/routes/protected/controllers'
import type { ICredentials } from '../../types/ICredentials'

interface SuperResponse<TBody = object> extends Response {
  body: TBody | IApiFailure
}

class TestUser {
  private readonly _agent: TestAgent
  private _token?: string | undefined
  private _credentials: ICredentials
  private _socket?: Socket
  private _url: string

  constructor(url: string, credentials?: ICredentials) {
    this._url = url
    this._agent = request.agent(url).set('Accept', 'application/json')
    this._credentials = credentials ?? { username: 'alice', password: 'secret' }
  }

  async login(): Promise<Response> {
    return this.agent
      .post('/auth/login')
      .send(this.credentials)
      .then(res => {
        const token = res.body?.data?.auth?.token
        if (res.status === 200 && typeof token === 'string') {
          this.token = token
        }

        return res
      })
  }

  async logout(): Promise<Response> {
    return this.agent.post('/auth/logout').set('Authorization', this.bearer)
  }

  async me(): Promise<SuperResponse<APIMeSuccess>> {
    return this.agent
      .get('/protected/me')
      .set('Authorization', this.bearer) as unknown as Promise<
      SuperResponse<APIMeSuccess>
    >
  }

  async health(): Promise<Response> {
    return this.agent.get('/public/health')
  }

  connectProtectedSocket(): Promise<Socket> {
    return new Promise((resolve, reject) => {
      const socket = ioClient(`${this.url}/protected`, {
        transports: ['websocket'],
        auth: { token: this.token },
      })

      socket.once('connect', () => {
        this._socket = socket
        resolve(socket)
      })

      socket.once('connect_error', err => {
        socket.close()
        reject(err)
      })
    })
  }

  connectPublicSocket(): Promise<Socket> {
    return new Promise((resolve, reject) => {
      const socket = ioClient(`${this.url}/public`, {
        transports: ['websocket'],
      })

      socket.once('connect', () => resolve(socket))
      socket.once('connect_error', reject)
    })
  }

  disconnectSocket() {
    this._socket?.disconnect()
    this._socket = undefined
  }

  get bearer() {
    return `Bearer ${this.token}`
  }

  get socket(): Socket | undefined {
    return this._socket
  }

  get agent() {
    return this._agent
  }

  set token(newToken: string | undefined) {
    this._token = newToken
  }

  get token() {
    return this._token
  }

  get url() {
    return this._url
  }

  private set url(url: string) {
    this._url = url
  }

  get credentials() {
    return this._credentials
  }

  private set credentials(newCredentials: ICredentials) {
    this._credentials = newCredentials
  }
}

export { TestUser }
