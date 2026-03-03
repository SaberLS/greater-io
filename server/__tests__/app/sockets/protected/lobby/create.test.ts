import type { Definition } from '../../../../../src/services'
import {
  buildTestServer,
  TestUsers,
  type TestUserMethods,
} from '../../../../utils'
import { expectLobbyId } from '../../../../utils/matchers/randomUUIDRegex'

describe('Protected Socket Namespace lobby:create', () => {
  const server = buildTestServer()

  let users: TestUsers
  let alice: TestUserMethods<'protectedSocket' | 'me'>

  beforeAll(async () => {
    await server.init()

    users = new TestUsers(server.url)
    alice = await users
      .prepareLoggedUser('alice', 'me', 'protectedSocket')
      .then(users.unpackData)
  })

  afterAll(async () => {
    await server.close()
    alice.protectedSocket.disconnect()
  })

  it('should create a lobby successfully', async () => {
    // Listen for the lobby state after creation
    const state: Definition.LobbyState =
      await new Promise<Definition.LobbyState>(resolve => {
        alice.protectedSocket.once('lobby:state', resolve)
        alice.protectedSocket.emit('lobby:create')
      })

    // Validate the returned lobby state
    expect(state).toEqual({
      id: expectLobbyId,
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
    } satisfies Definition.LobbyState)

    alice.protectedSocket.disconnect()
  })
})
