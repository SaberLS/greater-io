import MESSAGES from '@greater-io/server/src/CONSTS/MESSAGES.json'
import request from 'supertest'
import { buildTestServer, createExpectRes, TestUser } from '../../utils'

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
    let res: request.Response

    beforeAll(async () => {
      user = new TestUser(server.url)
      res = await user.me()
    })

    it('should respond with failure', () => {
      expectMe(res).fail(401).and.haveMessage()
    })

    it('response should not have any data', () => {
      expect(res.body.data).toBeUndefined()
    })
  })

  describe('authenticated user', () => {
    let user: TestUser
    let res: request.Response

    beforeAll(async () => {
      user = new TestUser(server.url)
      await user.login()

      res = await user.me()
    })

    it('should respond success with valid credentials', () => {
      expectMe(res).success(200).and.haveMessage()
    })

    it('response should have user data', () => {
      expect(res.body.data).toMatchObject({
        id: expect.any(Number),
        username: user.credentials.username,
      })
    })

    it('should not have any secret data', () => {
      expect(res.body.data.password).toBeUndefined()
      expect(res.body.data.tokenVersion).toBeUndefined()
    })
  })
})
