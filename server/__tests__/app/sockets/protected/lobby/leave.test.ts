import type { Socket } from 'socket.io-client'
import type { IUser, UserID } from '../../../../../src/models'

import type { LobbyState, LobbyUser } from '../../../../../src/services'
import { buildTestServer, TestUsers } from '../../../../utils'

describe('Protected Socket Namespace lobby:leave', () => {
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

    aliceSocket = await alice.connectProtectedSocket()
    patrykSocket = await patryk.connectProtectedSocket()

    state = await new Promise(resolve => {
      aliceSocket.once('lobby:state', resolve)
      aliceSocket.emit('lobby:create')
    })
    lobbyId = state.id

    state = await new Promise(resolve => {
      patrykSocket.once('lobby:state', resolve)
      patrykSocket.emit('lobby:join', state.id)
    })
  })

  afterAll(async () => {
    await server.close()
    aliceSocket.disconnect()
    patrykSocket.disconnect()
  })

  it('should remove user from the lobby', async () => {
    state = await new Promise(resolve => {
      aliceSocket.once('lobby:state', resolve)
      aliceSocket.once('lobby:error', resolve)
      aliceSocket.once('lobby:closed', resolve)

      patrykSocket.emit('lobby:leave')
    })

    expect(state).toEqual({
      id: lobbyId,
      ownerId: aliceData.id,
      status: 'open',
      maxPlayers: 4,
      currentPlayerCount: 1,
      players: {
        [aliceData.id]: {
          user: { id: aliceData.id, username: aliceData.username },
          status: 'not-ready',
          result: { score: 0 },
        },
      },
    } as LobbyState<UserID, LobbyUser>)
  })

  it('should transfer ownership after owner leaves', async () => {
    await new Promise(resolve => {
      patrykSocket.once('lobby:state', resolve)
      patrykSocket.emit('lobby:join', lobbyId)
    })

    const state: LobbyState<UserID, IUser> = await new Promise(resolve => {
      patrykSocket.once('lobby:state', resolve)
      aliceSocket.emit('lobby:leave')
    })

    expect(state).toEqual({
      id: lobbyId,
      ownerId: patrykData.id,
      status: 'open',
      maxPlayers: 4,
      currentPlayerCount: 1,
      players: {
        [patrykData.id]: {
          user: { id: patrykData.id, username: patrykData.username },
          status: 'not-ready',
          result: { score: 0 },
        },
      },
    } as LobbyState<UserID, LobbyUser>)
  })

  it('should respond with lobby:error when user is not a lobby member', async () => {
    // user tries to join, gets lobby:error
    const error = await new Promise<string>(resolve => {
      aliceSocket.once('lobby:error', resolve)
      aliceSocket.emit('lobby:leave', lobbyId)
    })

    expect(error).toBe(`User is not a lobby member`)
  })

  it('should dissolve lobby after last player leaves', async () => {
    // Last player leaves, lobby is destroyed
    patrykSocket.emit('lobby:leave')

    // Another user tries to join, gets lobby:error
    const error = await new Promise<string>(resolve => {
      aliceSocket.once('lobby:error', resolve)
      aliceSocket.emit('lobby:join', lobbyId)
    })

    expect(error).toBe(`Lobby with id: ${lobbyId}, is not available`)
  })
})
