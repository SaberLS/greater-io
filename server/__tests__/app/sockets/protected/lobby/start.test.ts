import { parseError } from '@greater-io/shared'
import type { IUser, UserID } from '../../../../../src/models'
import type {
  LobbyState,
  LobbyUser,
  LobbyUserID,
} from '../../../../../src/services'
import {
  buildTestServer,
  once,
  TestUsers,
  type TestUserMethods,
} from '../../../../utils'
import { expectLobbyId } from '../../../../utils/matchers/randomUUIDRegex'

describe('Protected Socket Namespace lobby:start', () => {
  const server = buildTestServer()

  let lobbyState: LobbyState<UserID, IUser>
  let owner: TestUserMethods<'protectedSocket' | 'me'>
  let member: TestUserMethods<'protectedSocket' | 'me'>

  let users: TestUsers

  beforeAll(async () => {
    await server.init()
    users = new TestUsers(server.url)

    await Promise.all([
      users.prepareLoggedUser('alice', 'me', 'protectedSocket'),
      users.prepareLoggedUser('patryk', 'me', 'protectedSocket'),
    ])
      .then(users.unpackDataArr)
      .then(([ow, mem]) => {
        owner = ow
        member = mem
      })

    owner.protectedSocket.emit('lobby:create')
    lobbyState = await once<LobbyState<LobbyUserID, LobbyUser>>(
      owner.protectedSocket,
      'lobby:state'
    )

    member.protectedSocket.emit('lobby:join', lobbyState.id)
    lobbyState = await once<LobbyState<LobbyUserID, LobbyUser>>(
      member.protectedSocket,
      'lobby:state'
    )
  })

  afterAll(async () => {
    await server.close()

    for (const usr of [owner, member]) usr.protectedSocket.disconnect()
  })

  it('should reject when user is not an lobby owner', async () => {
    member.protectedSocket.emit('lobby:start')
    const error = await once<string>(member.protectedSocket, 'lobby:error')

    expect(error).toEqual(
      `User with id: ${String(member.me.id)}, is not an owner of lobby: ${String(lobbyState.id)}`
    )
  })

  it('should reject when all users are not ready', async () => {
    owner.protectedSocket.emit('lobby:start')
    const error = await once<string>(owner.protectedSocket, 'lobby:error')

    expect(error).toEqual(`Not all lobby members are ready`)
  })

  it('should reject when not all users are ready', async () => {
    owner.protectedSocket.emit('lobby:status', 'ready')
    owner.protectedSocket.emit('lobby:start')
    const error = await once<string>(owner.protectedSocket, 'lobby:error')

    expect(error).toEqual(`Not all lobby members are ready`)
  })

  it('should start lobby countdown and emit events', async () => {
    member.protectedSocket.emit('lobby:status', 'ready')
    lobbyState = await once<LobbyState<LobbyUserID, LobbyUser>>(
      member.protectedSocket,
      'lobby:state'
    )

    const events: (number | string)[] = []
    const expectedEvents = ['start', 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 'end']

    owner.protectedSocket.on('lobby:start:count:start', () => {
      events.push('start')
    })
    owner.protectedSocket.on('lobby:start:count:tick', (c: string) => {
      events.push(c)
    })
    owner.protectedSocket.once('lobby:start:count:end', () => {
      events.push('end')
    })
    owner.protectedSocket.on('lobby:error', (e: unknown) => {
      throw parseError(e)
    })

    // start lobby
    owner.protectedSocket.emit('lobby:start')
    lobbyState = await once<LobbyState<LobbyUserID, LobbyUser>>(
      member.protectedSocket,
      'lobby:state'
    )

    // end countdown
    lobbyState = await once<LobbyState<LobbyUserID, LobbyUser>>(
      member.protectedSocket,
      'lobby:state'
    )

    expect(events).toEqual(expectedEvents)

    expect(lobbyState).toEqual({
      id: expectLobbyId,
      ownerId: owner.me.id,
      status: 'starting',
      maxMembers: 4,
      currentMemberCount: 2,
      members: {
        [owner.me.id]: {
          user: { id: owner.me.id, username: owner.me.username },
          status: 'ready',
        },
        [member.me.id]: {
          user: { id: member.me.id, username: member.me.username },
          status: 'ready',
        },
      },
    } as LobbyState<UserID, LobbyUser>)
  }, 15_000)
})
