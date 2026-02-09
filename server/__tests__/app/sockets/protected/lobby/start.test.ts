import { parseError } from '@greater-io/shared'
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

  let ownerSocket: Socket
  let ownerData: IUser
  let playerSocket: Socket
  let playerData: IUser

  let state: LobbyState<UserID, IUser>
  let lobbyId: LobbyState<UserID, IUser>['id']

  beforeAll(async () => {
    await server.init()
    users = new TestUsers(server.url)

    const [owner, player] = await Promise.all([
      users.getLoggedUser('alice'),
      users.getLoggedUser('patryk'),
    ])

    await Promise.all([owner.me(), player.me()]).then(([o, p]) => {
      ownerData = o.body.data
      playerData = p.body.data
    })

    await Promise.all([
      owner.connectProtectedSocket(),
      player.connectProtectedSocket(),
    ]).then(([a, p]) => {
      ownerSocket = a
      playerSocket = p
    })

    ownerSocket.emit('lobby:create')
    state = await once<LobbyState<LobbyUserID, LobbyUser>>(
      ownerSocket,
      'lobby:state'
    )
    lobbyId = state.id

    playerSocket.emit('lobby:join', state.id)
    state = await once<LobbyState<LobbyUserID, LobbyUser>>(
      playerSocket,
      'lobby:state'
    )
  })

  afterAll(async () => {
    await server.close()
    ownerSocket.disconnect()
    playerSocket.disconnect()
  })

  it('should reject when user is not an lobby owner', async () => {
    playerSocket.emit('lobby:start')
    const error = await once<string>(playerSocket, 'lobby:error')

    expect(error).toEqual(
      `User with id: ${String(playerData.id)}, is not an owner of lobby: ${String(lobbyId)}`
    )
  })

  it('should reject when all users are not ready', async () => {
    ownerSocket.emit('lobby:start')
    const error = await once<string>(ownerSocket, 'lobby:error')

    expect(error).toEqual(`Not all lobby members are ready`)
  })

  it('should reject when not all users are ready', async () => {
    ownerSocket.emit('lobby:status', 'ready')
    ownerSocket.emit('lobby:start')
    const error = await once<string>(ownerSocket, 'lobby:error')

    expect(error).toEqual(`Not all lobby members are ready`)
  })

  it('should start lobby countdown and emit events', async () => {
    playerSocket.emit('lobby:status', 'ready')
    state = await once<LobbyState<LobbyUserID, LobbyUser>>(
      playerSocket,
      'lobby:state'
    )

    const events: (number | string)[] = []
    const expectedEvents = ['start', 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 'end']

    ownerSocket.on('lobby:start:count:start', () => events.push('start'))
    ownerSocket.on('lobby:start:count:tick', (c: string) => {
      events.push(c)
    })
    ownerSocket.once('lobby:start:count:end', () => events.push('end'))
    ownerSocket.on('lobby:error', (e: unknown) => {
      throw parseError(e)
    })

    // start lobby
    ownerSocket.emit('lobby:start')
    state = await once<LobbyState<LobbyUserID, LobbyUser>>(
      playerSocket,
      'lobby:state'
    )
    state = await once<LobbyState<LobbyUserID, LobbyUser>>(
      playerSocket,
      'lobby:state'
    )

    expect(events).toEqual(expectedEvents)
    expect(state).toEqual({
      id: lobbyId,
      ownerId: ownerData.id,
      status: 'starting',
      maxMembers: 4,
      currentMemberCount: 2,
      members: {
        [ownerData.id]: {
          user: { id: ownerData.id, username: ownerData.username },
          status: 'ready',
        },
        [playerData.id]: {
          user: { id: playerData.id, username: playerData.username },
          status: 'ready',
        },
      },
    } as LobbyState<UserID, LobbyUser>)
  }, 15_000)
})
