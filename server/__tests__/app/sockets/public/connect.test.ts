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
    const socket = await user.publicSocket()

    expect(
      await new Promise<string>(resolve => {
        socket.once('public-pong', () => resolve('public-pong'))
        socket.emit('ping')
      })
    ).toBe('public-pong')

    socket.disconnect()
  })
})
