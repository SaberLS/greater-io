import type { LobbyState } from '../../../../../src/services/LobbyTypesDefinition'
import {
  buildTestServer,
  TestUsers,
  type TestUserMethods,
} from '../../../../utils'

const prepareUsers = (
  users: TestUsers
): Promise<TestUserMethods<'protectedSocket' | 'me'>[]> =>
  Promise.all([
    users.prepareLoggedUser('alice', 'me', 'protectedSocket'),
    users.prepareLoggedUser('patryk', 'me', 'protectedSocket'),
  ]).then(users.unpackDataArr)

describe('Protected Socket Namespace lobby:leave', () => {
  const server = buildTestServer()
  let users: TestUsers

  let alice: TestUserMethods<'protectedSocket' | 'me'>
  let patryk: TestUserMethods<'protectedSocket' | 'me'>

  let state: LobbyState
  let lobbyId: LobbyState['id']

  beforeAll(async () => {
    await server.init()
    users = new TestUsers(server.url)

    await prepareUsers(users).then(([alice_, patryk_]) => {
      alice = alice_
      patryk = patryk_
    })

    state = await new Promise(resolve => {
      alice.protectedSocket.once('lobby:state', resolve)
      alice.protectedSocket.emit('lobby:create')
    })
    lobbyId = state.id

    state = await new Promise(resolve => {
      patryk.protectedSocket.once('lobby:state', resolve)
      patryk.protectedSocket.emit('lobby:join', state.id)
    })
  })

  afterAll(async () => {
    await server.close()
    alice.protectedSocket.disconnect()
    patryk.protectedSocket.disconnect()
  })

  it('should remove user from the lobby', async () => {
    state = await new Promise(resolve => {
      alice.protectedSocket.once('lobby:state', resolve)
      alice.protectedSocket.once('lobby:error', resolve)
      alice.protectedSocket.once('lobby:closed', resolve)

      patryk.protectedSocket.emit('lobby:leave')
    })

    expect(state).toEqual({
      id: lobbyId,
      ownerId: alice.me.id,
      status: 'open',
      maxMembers: 4,
      currentMemberCount: 1,
      members: {
        [alice.me.id]: {
          user: { id: alice.me.id, username: alice.me.username },
          status: 'not-ready',
        },
      },
    } satisfies LobbyState)
  })

  it('should transfer ownership after owner leaves', async () => {
    let state: LobbyState = await new Promise(resolve => {
      patryk.protectedSocket.once('lobby:state', resolve)
      patryk.protectedSocket.emit('lobby:join', lobbyId)
    })

    state = await new Promise(resolve => {
      patryk.protectedSocket.once('lobby:state', resolve)
      alice.protectedSocket.emit('lobby:leave')
    })

    expect(state).toEqual({
      id: lobbyId,
      ownerId: patryk.me.id,
      status: 'open',
      maxMembers: 4,
      currentMemberCount: 1,
      members: {
        [patryk.me.id]: {
          user: { id: patryk.me.id, username: patryk.me.username },
          status: 'not-ready',
        },
      },
    } satisfies LobbyState)
  })

  it('should respond with lobby:error when user is not a lobby member', async () => {
    // user tries to join, gets lobby:error
    const error = await new Promise<string>(resolve => {
      alice.protectedSocket.once('lobby:error', resolve)
      alice.protectedSocket.emit('lobby:leave', lobbyId)
    })

    expect(error).toBe(`User is not a lobby member`)
  })

  it('should dissolve lobby after last member leaves', async () => {
    // Last member leaves, lobby is destroyed
    patryk.protectedSocket.emit('lobby:leave')

    // Another user tries to join, gets lobby:error
    const error = await new Promise<string>(resolve => {
      alice.protectedSocket.once('lobby:error', resolve)
      alice.protectedSocket.emit('lobby:join', lobbyId)
    })

    expect(error).toBe(`Lobby with id: ${lobbyId}, is not available`)
  })
})
