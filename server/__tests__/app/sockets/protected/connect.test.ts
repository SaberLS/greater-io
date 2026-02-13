import { buildTestServer, TestUser } from '../../../utils'

describe('Protected Socket Namespace', () => {
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

  it('should respond with secure-pong', async () => {
    await user.login()
    const socket = await user.protectedSocket()

    await new Promise<void>(resolve => {
      socket.once('secure-pong', msg => {
        expect(msg).toBe('secure-pong')
        resolve()
      })

      socket.emit('ping')
    })

    socket.disconnect()
  })

  it('should reject socket without token', async () => {
    const unauthUser = new TestUser(server.url)

    await expect(unauthUser.protectedSocket()).rejects.toThrow('Unauthorized')
  })
})
