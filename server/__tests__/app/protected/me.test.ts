import MESSAGES from '@greater-io/server/src/CONSTS/MESSAGES.json'
import {
  buildTestServer,
  createExpectRes,
  TestUser,
  type AssertSuperResSuccess,
} from '../../utils'

const expectMe = createExpectRes<[200, 401]>({
  ...MESSAGES.protected.me,
  ...MESSAGES.protected.validate,
})

describe('GET /protected/me', () => {
  const server = buildTestServer()

  beforeAll(async () => {
    await server.init()
  })

  afterAll(async () => {
    await server.close()
  })

  describe('unauthenticated user', () => {
    let user: TestUser
    let res: Awaited<ReturnType<typeof user.me>>

    beforeAll(async () => {
      user = new TestUser(server.url)
      res = await user.me()
    })

    // eslint-disable-next-line jest/expect-expect
    it('should respond with failure', () => {
      expectMe(res).fail(401).and.haveMessage()
    })

    it('response should not have any data', () => {
      // @ts-expect-error it's supposed to be undefined
      expect(res.body?.data).toBeUndefined()
    })
  })

  describe('authenticated user', () => {
    let user: TestUser
    let res: AssertSuperResSuccess<typeof user.me>

    beforeAll(async () => {
      user = new TestUser(server.url)
      await user.login()

      res = (await user.me()) as AssertSuperResSuccess<typeof user.me>
    })

    // eslint-disable-next-line jest/expect-expect
    it('should respond success with valid credentials', () => {
      expectMe(res).success(200).and.haveMessage()
    })

    it('response should have user data', () => {
      expect(res.body.data).toMatchObject({
        id: expect.any(Number) as number,
        username: user.credentials.username,
      })
    })

    it('should not have any secret data', () => {
      // @ts-expect-error it's supposed to be undefined
      expect(res.body.data.password).toBeUndefined()

      // @ts-expect-error it's supposed to be undefined
      expect(res.body.data.tokenVersion).toBeUndefined()
    })
  })
})
