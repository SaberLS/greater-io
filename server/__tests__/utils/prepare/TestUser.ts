import request, { type Response } from 'supertest'
import type TestAgent from 'supertest/lib/agent'

interface Credentials {
  username: string
  password: string
}

class TestUser {
  readonly _agent: TestAgent
  _token: string | undefined
  private _credentials: Credentials

  constructor(
    url: string,
    credentials = { username: 'alice', password: 'secret' }
  ) {
    this._agent = request.agent(url).set('Accept', 'application/json')
    this._credentials = credentials
  }

  login = (): Promise<Response> =>
    this.agent
      .post('/auth/login')
      .send(this.credentials)
      .then(res => {
        if (res.status === 200) this.token = res.body.token

        return res
      })

  logout = () => {
    return this.agent
      .post('/auth/logout')
      .set('Authorization', `Bearer ${this.token}`)
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
