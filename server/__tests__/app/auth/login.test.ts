import MESSAGES from '@greater-io/server/src/CONSTS/MESSAGES.json'
import request from 'supertest'
import { buildTestServer, createExpectRes, TestUser } from '../../utils'

const expectLogin = createExpectRes<[200, 401]>(MESSAGES.auth.login)

describe('POST /auth/login', () => {
  const server = buildTestServer()
  let agent!: TestUser

  beforeAll(async () => {
    await server.init()
    agent = new TestUser(server.url)
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

  it('should respond success with valid credentials', async () => {
    const res = await agent.login()

    expectLogin(res).success(200).and.haveMessage()
  })

  it('should respond with valid access token', async () => {
    const res = await agent.login()

    expect(res.body.token).toBeDefined()
    expect(res.body.token.length).toBeGreaterThan(0)
  })
})
