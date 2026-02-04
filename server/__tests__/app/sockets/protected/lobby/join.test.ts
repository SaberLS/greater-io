import type { Socket } from 'socket.io-client'
import type { IUser, UserID } from '../../../../../src/models'
import type { LobbyState, LobbyUser } from '../../../../../src/services'
import { buildTestServer, TestUsers } from '../../../../utils'

describe('Protected Socket Namespace lobby:create', () => {
  const server = buildTestServer()

  let users: TestUsers

  let aliceSocket: Socket
  let aliceData: IUser
  let patrykSocket: Socket
  let patrykData: IUser

  beforeAll(async () => {
    await server.init()
    users = new TestUsers(server.url)

    const [alice, patryk] = await Promise.all([
      users.getLoggedUser('alice'),
      users.getLoggedUser('patryk'),
    ])

    aliceData = (await alice.me()).body.data
    patrykData = (await patryk.me()).body.data

    aliceSocket = await alice.connectProtectedSocket()
    patrykSocket = await patryk.connectProtectedSocket()
  })

  afterAll(async () => {
    await server.close()
    aliceSocket.disconnect()
  })

  it('should join a lobby successfully', async () => {
    // Listen for the lobby state after creation
    const lobby = await new Promise<any>(resolve => {
      aliceSocket.once('lobby:state', resolve)

      aliceSocket.emit('lobby:create')
    })

    const [aliceState, patrykState] = await Promise.all([
      new Promise(resolve => aliceSocket.once('lobby:state', resolve)),
      new Promise(resolve => {
        patrykSocket.once('lobby:state', resolve)

        patrykSocket.emit('lobby:join', lobby.id)
      }),
    ])

    const expectedState: LobbyState<UserID, LobbyUser> = {
      id: lobby.id,
      ownerId: aliceData.id,
      status: 'open',
      maxPlayers: 4,
      currentPlayerCount: 2,
      players: {
        [patrykData.id]: {
          user: { id: patrykData.id, username: patrykData.username },
          status: 'not-ready',
          result: { score: 0 },
        },
        [aliceData.id]: {
          user: { id: aliceData.id, username: aliceData.username },
          status: 'not-ready',
          result: { score: 0 },
        },
      },
    }

    // Validate the returned lobby state
    expect(aliceState).toEqual(expectedState)
    expect(patrykState).toEqual(expectedState)

    aliceSocket.disconnect()
    patrykSocket.disconnect()
  })
})
