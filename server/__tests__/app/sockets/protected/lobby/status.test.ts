import type { Socket } from 'socket.io-client'
import type { IUser } from '../../../../../src/models'
import type {
  LobbyState,
  LobbyUser,
  LobbyUserID,
} from '../../../../../src/services'
import { buildTestServer, once, TestUsers } from '../../../../utils'

describe('Protected Socket Namespace lobby:status', () => {
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

    await Promise.all([
      await alice.connectProtectedSocket(),
      await patryk.connectProtectedSocket(),
    ]).then(([a, p]) => {
      aliceSocket = a
      patrykSocket = p
    })
  })

  afterAll(async () => {
    await server.close()

    aliceSocket.disconnect()
    patrykSocket.disconnect()
  })

  it('updates player status and emits lobby state', async () => {
    // Alice creates lobby
    aliceSocket.emit('lobby:create')
    const lobbyState = await once<LobbyState<LobbyUserID, LobbyUser>>(
      aliceSocket,
      'lobby:state'
    )

    // Patryk joins
    patrykSocket.emit('lobby:join', lobbyState.id)
    await once<LobbyState<LobbyUserID, LobbyUser>>(aliceSocket, 'lobby:state')

    // Patryk changes status
    patrykSocket.emit('lobby:status', 'ready')

    const updatedState = await once<LobbyState<LobbyUserID, LobbyUser>>(
      aliceSocket,
      'lobby:state'
    )
    expect(updatedState.players[patrykData.id].status).toBe('ready')
  })

  it('rejects invalid player status', async () => {
    aliceSocket.emit('lobby:status', 'INVALID_STATUS')

    const error = await once(aliceSocket, 'lobby:error')
    expect(error).toMatch(/not valid player status/i)
  })

  it('broadcasts updated state to all lobby members', async () => {
    patrykSocket.emit('lobby:status', 'not-ready')

    const [aliceState, patrykState] = await Promise.all([
      once(aliceSocket, 'lobby:state'),
      once(patrykSocket, 'lobby:state'),
    ])

    expect(aliceState).toEqual(patrykState)
  })
})
