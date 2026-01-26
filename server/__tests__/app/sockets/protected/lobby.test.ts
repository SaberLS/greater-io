import { buildTestServer, TestUsers } from '../../../utils'

describe('Protected Socket Namespace Lobby', () => {
  const server = buildTestServer()
  let users: TestUsers

  beforeAll(async () => {
    await server.init()
    users = new TestUsers(server.url)
  })

  afterAll(async () => {
    await server.close()
  })

  it('should create a lobby successfully', async () => {
    const user = await users.getLoggedUser('alice')
    const socket = await user.connectProtectedSocket()

    // Listen for the lobby state after creation
    const state = await new Promise<any>(resolve => {
      socket.once('lobby:state', lobbyState => {
        resolve(lobbyState)
      })

      socket.emit('lobby:create')
    })

    // Validate the returned lobby state
    expect(state).toEqual({
      id: expect.any(String),
      ownerId: 2,
      status: 'open',
      maxPlayers: 4,
      currentPlayerCount: 1,
      players: {
        '2': {
          id: 2,
          username: user.credentials.username,
          status: 'not-ready',
          result: { score: 0, time: 0 },
        },
      },
    })

    socket.disconnect()
  })

  it('should join a lobby successfully', async () => {
    const [alice, patryk] = await Promise.all([
      users.getLoggedUser('alice'),
      users.getLoggedUser('patryk'),
    ])

    const [aliceSocket, patrykSocket] = await Promise.all([
      alice.connectProtectedSocket(),
      patryk.connectProtectedSocket(),
    ])

    const [
      {
        body: { data: aliceData },
      },
      {
        body: { data: patrykData },
      },
    ] = await Promise.all([alice.me(), patryk.me()])

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

    const expectedState = {
      id: lobby.id,
      ownerId: aliceData.id,
      status: 'open',
      maxPlayers: 4,
      currentPlayerCount: 2,
      players: {
        [patrykData.id]: {
          id: patrykData.id,
          username: patryk.credentials.username,
          status: 'not-ready',
          result: { score: 0, time: 0 },
        },
        [aliceData.id]: {
          id: aliceData.id,
          username: alice.credentials.username,
          status: 'not-ready',
          result: { score: 0, time: 0 },
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
