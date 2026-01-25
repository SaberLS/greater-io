import MESSAGES from '@greater-io/server/src/CONSTS/MESSAGES.json'
import { buildTestServer, createExpectRes, TestUser } from '../../utils'

const expectLogout = createExpectRes<[200, 401]>(MESSAGES.auth.logout)

describe('POST /auth/logout', () => {
  const server = buildTestServer()
  let agent: TestUser

  beforeAll(async () => {
    await server.init()
    agent = new TestUser(server.url)
  })

  afterAll(async () => {
    await server.close()
  })

  it('should fail when user is not logged in', async () => {
    const res = await agent.logout()

    expectLogout(res).fail(401).and.haveMessage()
  })

  it('should succed when user is logged in', async () => {
    await agent.login()
    const res = await agent.logout()

    expectLogout(res).success().and.haveMessage()
  })
})
