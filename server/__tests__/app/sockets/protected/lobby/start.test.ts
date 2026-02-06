import type { Socket } from 'socket.io-client'
import type { IUser, UserID } from '../../../../../src/models'
import type {
  LobbyState,
  LobbyUser,
  LobbyUserID,
} from '../../../../../src/services'
import { buildTestServer, once, TestUsers } from '../../../../utils'

describe('Protected Socket Namespace lobby:start', () => {
  const server = buildTestServer()
  let users: TestUsers

  let aliceSocket: Socket
  let aliceData: IUser
  let patrykSocket: Socket
  let patrykData: IUser

  let state: LobbyState<UserID, IUser>
  let lobbyId: LobbyState<UserID, IUser>['id']

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

    aliceSocket.emit('lobby:create')
    state = await once<LobbyState<LobbyUserID, LobbyUser>>(
      aliceSocket,
      'lobby:state'
    )
    lobbyId = state.id

    patrykSocket.emit('lobby:join', state.id)
    state = await once<LobbyState<LobbyUserID, LobbyUser>>(
      patrykSocket,
      'lobby:state'
    )
  })

  afterAll(async () => {
    await server.close()
    aliceSocket.disconnect()
    patrykSocket.disconnect()
  })

  it('should reject when user is not an lobby owner', async () => {
    patrykSocket.emit('lobby:start')
    const error = await once(patrykSocket, 'lobby:error')

    expect(error).toEqual(
      `User with id: ${String(patrykData.id)}, is not an owner of lobby: ${String(lobbyId)}`
    )
  })

  it('should reject when all users are not ready', async () => {
    aliceSocket.emit('lobby:start')
    const error = await once(aliceSocket, 'lobby:error')

    expect(error).toEqual(`Not all lobby members are ready`)
  })

  it('should reject when not all users are ready', async () => {
    aliceSocket.emit('lobby:status', 'ready')
    aliceSocket.emit('lobby:start')
    const error = await once(aliceSocket, 'lobby:error')

    expect(error).toEqual(`Not all lobby members are ready`)
  })

  it('should reject when not all users are ready', async () => {
    aliceSocket.emit('lobby:status', 'ready')
    aliceSocket.emit('lobby:start')
    const error = await once(aliceSocket, 'lobby:error')

    expect(error).toEqual(`Not all lobby members are ready`)
  })

  it('should succed when all users are ready', async () => {
    patrykSocket.emit('lobby:status', 'ready')
    state = await once(aliceSocket, 'lobby:state').then(() => {
      aliceSocket.emit('lobby:start')
      return once(aliceSocket, 'lobby:state')
    })

    expect(state).toEqual({
      id: lobbyId,
      ownerId: aliceData.id,
      status: 'starting',
      maxMembers: 4,
      currentMemberCount: 2,
      members: {
        [aliceData.id]: {
          user: { id: aliceData.id, username: aliceData.username },
          status: 'in-game',
        },
        [patrykData.id]: {
          user: { id: patrykData.id, username: patrykData.username },
          status: 'in-game',
        },
      },
    } as LobbyState<UserID, LobbyUser>)
  })
})
