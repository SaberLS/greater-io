import MESSAGES from '@greater-io/server/src/CONSTS/MESSAGES.json'
import {
  buildTestServer,
  createExpectRes,
  TestUser,
  TestUsers,
  type AssertSuperResSuccess,
} from '../../utils'

const expectLogin = createExpectRes<[200, 401]>(MESSAGES.auth.login)

describe('POST /auth/login', () => {
  const server = buildTestServer()
  let users: TestUsers

  beforeAll(async () => {
    await server.init()
    users = new TestUsers(server.url)
  })

  afterAll(async () => {
    await server.close()
  })

  describe('Valid Credentials', () => {
    let agent: TestUser
    let res: AssertSuperResSuccess<TestUser['login']>

    beforeAll(async () => {
      agent = users.getUser('patryk')

      res = (await agent.login()) as AssertSuperResSuccess<TestUser['login']>
    })

    // eslint-disable-next-line jest/expect-expect
    it('should respond with success', () => {
      expectLogin(res).success(200).and.haveMessage()
    })

    it('should respond with valid auth data', () => {
      const { auth } = res.body.data

      expect(auth).toEqual({
        token: expect.any(String) as string,
        expiresIn: expect.any(Number) as number,
        expiresAt: expect.any(Number) as number,
      })
    })
  })

  describe('Invalid Credentials', () => {
    // eslint-disable-next-line jest/expect-expect
    it('should reject with wrong password', async () => {
      const agent = users.getUser('wrong-password')
      const response = await agent.login()

      expectLogin(response).fail(401).and.haveMessage()
    })

    // eslint-disable-next-line jest/expect-expect
    it('should reject with empty credentials', async () => {
      const agent = users.getUser('empty')
      const response = await agent.login()

      expectLogin(response).fail(401).and.haveMessage()
    })

    // eslint-disable-next-line jest/expect-expect
    it('should reject with credentials of not existing user', async () => {
      const agent = users.getUser('non-existing')
      const response = await agent.login()

      expectLogin(response).fail(401).and.haveMessage()
    })
  })
})
