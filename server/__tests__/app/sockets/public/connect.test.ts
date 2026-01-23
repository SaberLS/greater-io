import { buildTestServer, TestUser } from '../../../utils'

describe('Public Socket Namespace', () => {
  const server = buildTestServer()
  let user: TestUser

  beforeAll(async () => {
    await server.init()
    user = new TestUser(server.url)
  })

  afterAll(async () => {
    user.disconnectSocket()
    await server.close()
  })

  it('public socket responds to ping', async () => {
    const socket = await user.connectPublicSocket()

    await new Promise<void>(resolve => {
      socket.once('public-pong', () => resolve())
      socket.emit('ping')
    })

    socket.disconnect()
  })
})
