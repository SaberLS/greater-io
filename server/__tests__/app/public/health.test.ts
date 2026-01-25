import MESSAGES from '@greater-io/server/src/CONSTS/MESSAGES.json'
import { createExpectRes, TestUser } from '../../utils'
import { buildTestServer } from '../../utils/prepare/buildTestServer'

const expectRes = createExpectRes(MESSAGES.public.health)

describe('GET public/health', () => {
  const server = buildTestServer()
  let user: TestUser

  beforeAll(async () => {
    await server.init()
    user = new TestUser(server.url)
  })

  afterAll(async () => {
    await server.close()
  })

  it('should return success', async () => {
    const res = await user.health()
    expectRes(res).success().and.haveMessage()
  })
})
