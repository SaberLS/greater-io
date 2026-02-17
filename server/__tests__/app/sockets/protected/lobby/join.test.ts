import type { LobbyState } from '../../../../../src/services'
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

describe('Protected Socket Namespace lobby:create', () => {
  const server = buildTestServer()

  let users: TestUsers
  let alice: TestUserMethods<'protectedSocket' | 'me'>
  let patryk: TestUserMethods<'protectedSocket' | 'me'>

  beforeAll(async () => {
    await server.init()
    users = new TestUsers(server.url)

    await prepareUsers(users).then(([alice_, patryk_]) => {
      alice = alice_
      patryk = patryk_
    })
  })

  it('should join a lobby successfully', async () => {
    // Listen for the lobby state after creation
    const lobby = await new Promise<LobbyState>(resolve => {
      alice.protectedSocket.once('lobby:state', resolve)
      alice.protectedSocket.emit('lobby:create')
    })

    const [aliceState, patrykState] = await Promise.all([
      new Promise(resolve =>
        alice.protectedSocket.once('lobby:state', resolve)
      ),
      new Promise(resolve => {
        patryk.protectedSocket.once('lobby:state', resolve)
        patryk.protectedSocket.emit('lobby:join', lobby.id)
      }),
    ])

    const expectedState: LobbyState = {
      id: lobby.id,
      ownerId: alice.me.id,
      status: 'open',
      maxMembers: 4,
      currentMemberCount: 2,
      members: {
        [patryk.me.id]: {
          user: { id: patryk.me.id, username: patryk.me.username },
          status: 'not-ready',
        },
        [alice.me.id]: {
          user: { id: alice.me.id, username: alice.me.username },
          status: 'not-ready',
        },
      },
    }

    // Validate the returned lobby state
    expect(aliceState).toEqual(expectedState)
    expect(patrykState).toEqual(expectedState)
  })
})
