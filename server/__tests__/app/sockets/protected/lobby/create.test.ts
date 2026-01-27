import type { Socket } from 'socket.io-client'
import type { IUser } from '../../../../../src/models'
import type { LobbyState } from '../../../../../src/services/LobbyManager/Lobby/Lobby'
import { buildTestServer, TestUsers } from '../../../../utils'
import { randomUUIDRegex } from '../../../../utils/matchers/randomUUIDRegex'

describe('Protected Socket Namespace lobby:create', () => {
  const server = buildTestServer()

  let users: TestUsers
  let aliceSocket: Socket
  let aliceData: IUser

  beforeAll(async () => {
    await server.init()
    users = new TestUsers(server.url)

    const alice = await users.getLoggedUser('alice')
    aliceData = (await alice.me()).body.data
    aliceSocket = await alice.connectProtectedSocket()
  })

  afterAll(async () => {
    await server.close()
    aliceSocket.disconnect()
  })

  it('should create a lobby successfully', async () => {
    // Listen for the lobby state after creation
    const state: LobbyState = await new Promise<any>(resolve => {
      aliceSocket.once('lobby:state', resolve)
      aliceSocket.emit('lobby:create')
    })

    // Validate the returned lobby state
    expect(state).toEqual({
      id: expect.stringMatching(randomUUIDRegex),
      ownerId: aliceData.id,
      status: 'open',
      maxPlayers: 4,
      currentPlayerCount: 1,
      players: {
        [aliceData.id]: {
          id: aliceData.id,
          username: aliceData.username,
          status: 'not-ready',
          result: { score: 0, time: 0 },
        },
      },
    })

    aliceSocket.disconnect()
  })
})
