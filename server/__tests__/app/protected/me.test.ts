import MESSAGES from '@greater-io/server/src/CONSTS/MESSAGES.json'
import { buildTestServer, createExpectRes, TestUser } from '../../utils'

const expectMe = createExpectRes<[200, 401]>({
  ...MESSAGES.protected.me,
  ...MESSAGES.protected.validate,
})

describe('GET /protected/me', () => {
  const server = buildTestServer()
  let user: TestUser

  beforeAll(async () => {
    await server.init()
    user = new TestUser(server.url)
  })

  afterAll(async () => {
    await server.close()
  })

  it('should respond success with valid credentials', async () => {
    await user.login()
    const res = await user.me()

    expectMe(res).success(200).and.haveMessage()
  })

  it('response should have user data', async () => {
    const res = await user.me()

    expect(res.body.user).toHaveProperty('username')
    expect(res.body.user).toHaveProperty('id')
  })
})
