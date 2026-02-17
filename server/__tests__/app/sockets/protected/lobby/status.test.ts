import type { LobbyState } from '../../../../../src/services'
import {
  buildTestServer,
  once,
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

describe('Protected Socket Namespace lobby:status', () => {
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

  afterAll(async () => {
    await server.close()

    alice.protectedSocket.disconnect()
    patryk.protectedSocket.disconnect()
  })

  it('updates member status and emits lobby state', async () => {
    // Alice creates lobby
    alice.protectedSocket.emit('lobby:create')
    const lobbyState = await once<LobbyState>(
      alice.protectedSocket,
      'lobby:state'
    )

    // Patryk joins
    patryk.protectedSocket.emit('lobby:join', lobbyState.id)
    await once<LobbyState>(alice.protectedSocket, 'lobby:state')

    // Patryk changes status
    patryk.protectedSocket.emit('lobby:status', 'ready')
    const updatedState = await once<LobbyState>(
      alice.protectedSocket,
      'lobby:state'
    )
    expect(updatedState.members[patryk.me.id].status).toBe('ready')
  })

  it('rejects invalid member status', async () => {
    alice.protectedSocket.emit('lobby:status', 'INVALID_STATUS')

    const error = await once<string>(alice.protectedSocket, 'lobby:error')
    expect(error).toMatch(/not valid member status/i)
  })

  it('broadcasts updated state to all lobby members', async () => {
    patryk.protectedSocket.emit('lobby:status', 'not-ready')

    const [aliceState, patrykState] = await Promise.all([
      once<LobbyState>(alice.protectedSocket, 'lobby:state'),
      once<LobbyState>(patryk.protectedSocket, 'lobby:state'),
    ])

    expect(aliceState).toEqual(patrykState)
  })
})
