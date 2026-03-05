import { parseError } from '@greater-io/shared'
import type { Namespace } from 'socket.io'
import type { ISocketUser } from '../../models'
import { Lobby } from '../../services'
import {
  GameInstance,
  GameLobby,
  GameLobbyManager,
  Player,
  SimpleMathEngine,
  type IPlayer,
} from '../../services/Game'
import { LobbyStore } from '../../services/Lobby/LobbyStore'
import { Definition } from '../../services/Lobby/types'
import type { LobbyUserID } from '../../services/LobbyTypesDefinition'
import type {
  IoAuthenticatedNamespace,
  IoAuthenticatedSocket,
} from '../../types/AuthSocket'
import { socketJwtAuth } from './socketJWTAuth'

function registerProtectedNamespace(
  namespace: Namespace
): IoAuthenticatedNamespace {
  // HACK: it works with promise
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  const protectedNs = namespace.use(socketJwtAuth) as IoAuthenticatedNamespace

  const createPlayer = (
    user: Definition.LobbyTypes['member']['user']
  ): IPlayer<Definition.LobbyTypes['player']> => {
    return new Player<Definition.PlayerTypes, Definition.PlayerState>(
      user,
      {} as Definition.PlayerTypes['score'],
      'ready',
      (player): Definition.PlayerState => ({
        status: player.status,
        score: player.score,
        user: {
          id: player.user.id,
          username: player.user.username,
        },
      })
    )
  }

  const engine = new SimpleMathEngine()

  const createGameState = (
    t: GameInstance<Definition.GameTypes, Definition.GameState>
  ): Definition.GameState => ({
    leaderboard: t.leaderboard.map(
      (player): Definition.GameTypes['player']['user']['id'] => player.user.id
    ),
    questions: t.questions.map((questions): string => questions.task),
    status: t.status,
    players: [...t.players.values()].map(player => player.state),
  })

  const createGame = (
    users: readonly Definition.LobbyTypes['member']['user'][]
  ): Definition.LobbyTypes['game_instance'] => {
    return new GameInstance<Definition.GameTypes, Definition.GameState>(
      Math.random(),
      users as ISocketUser[],
      engine,
      createPlayer,
      createGameState
    )
  }

  const createMemberState = (
    member: Lobby.LobbyMember<
      Definition.MemberTypes,
      Definition.LobbyMemberState
    >
  ): Definition.LobbyMemberState => ({
    user: { id: member.user.id, username: member.user.username },
    status: member.status as Definition.LobbyMemberStatus,
  })

  const createMember = (user: Definition.LobbyUser): Definition.LobbyMember =>
    new Lobby.LobbyMember<
      Lobby.Definition.MemberTypes,
      Lobby.Definition.LobbyMemberState
    >(user, createMemberState, 'not-ready')

  const membersState = (
    members: Readonly<Map<LobbyUserID, Definition.LobbyMember>>
  ): Definition.LobbyState['members'] => {
    const result = {} as Record<LobbyUserID, Definition.LobbyMemberState>

    for (const [id, member] of members.entries()) result[id] = member.state

    return Object.freeze(result)
  }

  const createLobbyState = (
    lobby: Lobby.Lobby<Lobby.Definition.LobbyTypes, Lobby.Definition.LobbyState>
  ): Definition.LobbyState => ({
    id: lobby.id,
    ownerId: lobby.owner?.id,
    status: lobby.status,
    maxMembers: lobby.maxMembers,
    currentMemberCount: lobby.membersSize,
    members: membersState(lobby.members),
  })

  const createLobby = (
    user: Lobby.Definition.LobbyUser
  ): Lobby.Definition.Lobby =>
    new GameLobby<Lobby.Definition.LobbyTypes, Lobby.Definition.LobbyState>(
      createGame,
      crypto.randomUUID(),
      user,
      createMember,
      createLobbyState
    )

  const store = new LobbyStore<Definition.LobbyTypes, Definition.Lobby>()
  const lobbyManager: Definition.Manager = new GameLobbyManager<
    Definition.LobbyTypes,
    Definition.Lobby,
    Definition.LobbyStore
  >(createLobby, store)

  lobbyManager.event.on(
    'lobby:game:scheduled',
    ({ lobbyId, startAt, gameState, lobbyState }): void => {
      emitLobbyState(lobbyState)
      emitGameState(lobbyId, gameState as Definition.GameState)

      protectedNs
        .to(`lobby:${lobbyId}`)
        .emit('lobby:game-scheduled', { startAt })
    }
  )

  lobbyManager.event.on(
    'lobby:game:started',
    ({ lobbyId, gameState, lobbyState }): void => {
      emitLobbyState(lobbyState)
      emitGameState(lobbyId, gameState as Definition.GameState)

      protectedNs.to(`lobby:${lobbyId}`).emit('lobby:game-started')
    }
  )

  lobbyManager.event.on(
    'lobby:game:ended',
    ({ lobbyId, gameState, lobbyState }): void => {
      emitLobbyState(lobbyState)
      emitGameState(lobbyId, gameState as Definition.GameState)

      protectedNs.to(`lobby:${lobbyId}`).emit('lobby:game-ended')
    }
  )

  lobbyManager.event.on(
    'lobby:game:answer',
    ({ lobbyId, gameState, lobbyState, score, playerId }): void => {
      emitLobbyState(lobbyState)
      emitGameState(lobbyId, gameState as Definition.GameState)

      protectedNs
        .to(`lobby:${lobbyId}`)
        .emit('lobby:game-answer', { answer_score: score, playerId })
    }
  )
  // const s = lobbyManager.close('4-4-4-4-4-4-4')

  // check if user exists and if user is already connected
  protectedNs.use((socket: IoAuthenticatedSocket, next): void => {
    const { user } = socket.data

    if (!user) return next(new Error('Unauthorized'))
    if (user.socketId) return next(new Error('User already connected'))

    user.socketId = socket.id
    next()
  })

  const emitLobbyState = (
    lobby: Definition.LobbyState,
    room = `lobby:${lobby.id}`
  ): void => {
    protectedNs.to(room).emit('lobby:state', lobby)
  }

  const emitGameState = (
    lobbyid: Definition.LobbyID,
    game: Definition.GameState,
    room = `lobby:${lobbyid}`
  ): void => {
    protectedNs.to(room).emit('lobby:game-state', game)
  }

  protectedNs.on('connection', (socket): void => {
    const { user } = socket.data

    socket.on('ping', (): void => {
      socket.emit('secure-pong', 'secure-pong')
    })

    const listenerHandler = <TArgs extends unknown[]>(
      listener: (
        ...args: TArgs
      ) =>
        | (Definition.LobbyState | void)
        | Promise<Definition.LobbyState | void>,
      options?: Partial<{
        emitError: boolean
        emitState: boolean
      }>
    ): ((...args: Partial<TArgs>) => Promise<void>) => {
      const opt = {
        emitError: true,
        emitState: true,
        ...options,
      }

      return async (...args: Partial<TArgs>): Promise<void> => {
        try {
          // TODO: add validation like validate: (...args: unknown[]) => TArgs
          // @ts-expect-error added todo
          const lobby = await listener(...args)

          if (opt.emitState && lobby) emitLobbyState(lobby)
        } catch (error) {
          if (opt.emitError)
            socket.emit('lobby:error', parseError(error).message)
        }
      }
    }

    const leaveLobbySafely = async (
      reason: 'leave' | 'disconnect'
    ): Promise<void> => {
      try {
        const lobby = lobbyManager.leave(socket.data.user)

        const lobbyRoom = `lobby:${lobby.id}`
        await socket.leave(lobbyRoom)

        protectedNs.to(lobbyRoom).emit('lobby:state', lobby)
      } catch (error) {
        if (reason === 'leave')
          socket.emit('lobby:error', parseError(error).message)
      } finally {
        socket.data.lobbyId = undefined
      }
    }

    socket.on(
      'lobby:create',
      listenerHandler(async (): Promise<Definition.LobbyState> => {
        const lobby = lobbyManager.create(socket.data.user)

        socket.data.lobbyId = lobby.id
        await socket.join(`lobby:${lobby.id}`)

        return lobby
      })
    )

    socket.on(
      'lobby:join',
      listenerHandler<[lobbyId: Definition.LobbyID]>(
        async (lobbyId): Promise<Definition.LobbyState> => {
          const lobby = lobbyManager.join(user, lobbyId)

          await socket.join(`lobby:${String(lobby.id)}`)
          socket.data.lobbyId = lobby.id

          return lobby
        }
      )
    )

    socket.on('lobby:leave', async (): Promise<void> => {
      await leaveLobbySafely('leave')
    })

    socket.on('disconnect', async (): Promise<void> => {
      await leaveLobbySafely('disconnect')

      // @ts-expect-error clear the socket on user disconnection
      delete user.socketId
    })

    socket.on(
      'lobby:status',
      listenerHandler<[status: Definition.LobbyMemberStatus]>(
        (status: Definition.LobbyMemberStatus): Definition.LobbyState =>
          lobbyManager.changeStatus(user, status)
      )
    )

    socket.on('lobby:start', (): void => {
      try {
        const lobby = lobbyManager.createGame(user) // wires events and returns initial state

        const lobbyRoom = `lobby:${lobby.id}`
        protectedNs.to(lobbyRoom).emit('lobby:state', lobby)

        lobbyManager.scheduleGame(user)
      } catch (error) {
        socket.emit('lobby:error', parseError(error).message)
      }
    })

    socket.on(
      'lobby:game:submit-answer',
      listenerHandler((answer: { index: number; answer: 'string' }): void => {
        lobbyManager.submitAnswer(socket.data.user, answer) // wires events and returns initial state
      })
    )
  })

  return protectedNs
}

export { registerProtectedNamespace }
