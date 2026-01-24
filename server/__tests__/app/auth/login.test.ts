import MESSAGES from '@greater-io/server/src/CONSTS/MESSAGES.json'
import request from 'supertest'
import { buildTestServer, createExpectRes, TestUser } from '../../utils'

const expectLogin = createExpectRes<[200, 401]>(MESSAGES.auth.login)

describe('POST /auth/login', () => {
  const server = buildTestServer()
  let agent!: TestUser
  let res: request.Response

  beforeAll(async () => {
    await server.init()
    agent = new TestUser(server.url)
    res = await agent.login()
  })

  afterAll(async () => {
    await server.close()
  })

  it('should reject with invalid credentials', async () => {
    const response = await request(server.url)
      .post('/auth/login')
      .send({ username: 'alice', password: 'wrong' })
      .set('Accept', 'application/json')

    expectLogin(response).fail(401).and.haveMessage()
  })

  it('should respond with success', async () => {
    expectLogin(res).success(200).and.haveMessage()
  })

  it('should respond with valid auth data', async () => {
    const { auth } = res.body.data

    expect(auth).toHaveProperty('token')
    expect(auth).toHaveProperty('expiresIn')
    expect(auth).toHaveProperty('expiresAt')
  })

  it('should not have any secret data', () => {
    const { user } = res.body.data

    expect(user).not.toHaveProperty('password')
    expect(user).not.toHaveProperty('tokenVersion')
  })
})
