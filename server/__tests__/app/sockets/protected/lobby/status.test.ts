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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

    await Promise.all([alice.me(), patryk.me()]).then(([a, p]) => {
      aliceData = a.body.data
      patrykData = p.body.data
    })

    await Promise.all([
      alice.connectProtectedSocket(),
      patryk.connectProtectedSocket(),
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

  it('updates member status and emits lobby state', async () => {
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
    expect(updatedState.members[patrykData.id].status).toBe('ready')
  })

  it('rejects invalid member status', async () => {
    aliceSocket.emit('lobby:status', 'INVALID_STATUS')

    const error = await once<string>(aliceSocket, 'lobby:error')
    expect(error).toMatch(/not valid member status/i)
  })

  it('broadcasts updated state to all lobby members', async () => {
    patrykSocket.emit('lobby:status', 'not-ready')

    const [aliceState, patrykState] = await Promise.all([
      once<LobbyState<LobbyUserID, LobbyUser>>(aliceSocket, 'lobby:state'),
      once<LobbyState<LobbyUserID, LobbyUser>>(patrykSocket, 'lobby:state'),
    ])

    expect(aliceState).toEqual(patrykState)
  })
})
