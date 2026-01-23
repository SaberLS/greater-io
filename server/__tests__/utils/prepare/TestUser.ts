import request, { type Response } from 'supertest'
import type TestAgent from 'supertest/lib/agent'

interface Credentials {
  username: string
  password: string
}

class TestUser {
  private readonly _agent: TestAgent
  private _token: string | undefined
  private _credentials: Credentials

  constructor(
    url: string,
    credentials = { username: 'alice', password: 'secret' }
  ) {
    this._agent = request.agent(url).set('Accept', 'application/json')
    this._credentials = credentials
  }

  async login(): Promise<Response> {
    return this.agent
      .post('/auth/login')
      .send(this.credentials)
      .then(res => {
        if (res.status === 200) this.token = res.body.token

        return res
      })
  }

  async logout(): Promise<Response> {
    return this.agent.post('/auth/logout').set('Authorization', this.bearer)
  }

  async me(): Promise<Response> {
    return this.agent.get('/protected/me').set('Authorization', this.bearer)
  }

  async health(): Promise<Response> {
    return this.agent.get('/api/public/health')
  }

  get bearer() {
    return `Bearer ${this.token}`
  }

  set token(newToken: string | undefined) {
    this._token = newToken
  }

  get agent() {
    return this._agent
  }

  get token() {
    return this._token
  }

  get credentials() {
    return this._credentials
  }

  private set credentials(newCredentials: Credentials) {
    this._credentials = newCredentials
  }
}

export { TestUser }
