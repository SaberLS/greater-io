import { parseError } from '@greater-io/shared'
import type { Namespace } from 'socket.io'
import { Lobby, LobbyMember } from '../../services'
import type { ILobbyManager } from '../../services/Lobby/'
import { LobbyManager } from '../../services/Lobby/LobbyManager'
import { LobbyStore } from '../../services/Lobby/LobbyStore'
import type {
  LobbyID,
  LobbyMemberState,
  LobbyMemberStatus,
  LobbyMemberT,
  LobbyState,
  LobbyStatus,
  LobbyStoreT,
  LobbyT,
  LobbyUser,
  LobbyUserID,
  LobbyUserState,
} from '../../services/Lobby/types'
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

  const createMember = (user: LobbyUser): LobbyMemberT => new LobbyMember(user)
  const createLobby = (user: LobbyUser): LobbyT =>
    new Lobby(crypto.randomUUID(), user, createMember)

  const lobbyManager: ILobbyManager<
    LobbyID,
    LobbyUserID,
    LobbyUser,
    LobbyUserState,
    LobbyMemberStatus,
    LobbyMemberState,
    LobbyMemberT,
    LobbyStatus,
    LobbyState
  > = new LobbyManager<
    LobbyID,
    LobbyUserID,
    LobbyUser,
    LobbyUserState,
    LobbyMemberStatus,
    LobbyMemberState,
    LobbyMemberT,
    LobbyStatus,
    LobbyState,
    LobbyT,
    LobbyStoreT
  >(createLobby, new LobbyStore())

  // check if user exists and if user is already connected
  protectedNs.use((socket: IoAuthenticatedSocket, next) => {
    const { user } = socket.data

    if (!user) return next(new Error('Unauthorized'))
    if (user.socketId) return next(new Error('User already connected'))

    user.socketId = socket.id
    next()
  })

  const emitLobbyState = (lobby: LobbyState, room = `lobby:${lobby.id}`) =>
    protectedNs.to(room).emit('lobby:state', lobby)

  protectedNs.on('connection', socket => {
    const { user } = socket.data

    socket.on('ping', () => {
      socket.emit('secure-pong', 'secure-pong')
    })

    const listenerHandler = <TArgs extends unknown[]>(
      listener: (
        ...args: TArgs
      ) => (LobbyState | void) | Promise<LobbyState | void>,
      options?: Partial<{
        emitError: boolean
        emitState: boolean
      }>
    ) => {
      const opt = {
        emitError: true,
        emitState: true,
        ...options,
      }

      return async (...args: Partial<TArgs>) => {
        try {
          // TODO: add validation like validate: (...args: unknown[]) => TArgs
          // @ts-expect-error
          const lobby = await listener(...args)

          if (opt.emitState && lobby) emitLobbyState(lobby)
        } catch (error) {
          if (opt.emitError)
            socket.emit('lobby:error', parseError(error).message)
        }
      }
    }

    const leaveLobbySafely = async (reason: 'leave' | 'disconnect') => {
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
      listenerHandler(async () => {
        const lobby = lobbyManager.create(socket.data.user)

        socket.data.lobbyId = lobby.id
        await socket.join(`lobby:${lobby.id}`)

        return lobby
      })
    )

    socket.on(
      'lobby:join',
      listenerHandler<[lobbyId: LobbyID]>(async lobbyId => {
        const lobby = lobbyManager.join(user, lobbyId)

        await socket.join(`lobby:${lobby.id}`)
        socket.data.lobbyId = lobby.id

        return lobby
      })
    )

    socket.on('lobby:leave', async () => {
      await leaveLobbySafely('leave')
    })

    socket.on('disconnect', async () => {
      await leaveLobbySafely('disconnect')

      // @ts-expect-error clear the socket on user disconnection
      delete user.socketId
    })

    socket.on(
      'lobby:status',
      listenerHandler<[status: LobbyMemberStatus]>(
        (status: LobbyMemberStatus) => lobbyManager.changeStatus(user, status)
      )
    )

    socket.on('lobby:start', async () => {
      try {
        await lobbyManager.start(user, {
          onStart(lobby: LobbyState) {
            protectedNs.to(`lobby:${lobby.id}`).emit('lobby:start:count:start')

            emitLobbyState(lobby)
          },
          onTick(count: number, lobby: LobbyState) {
            protectedNs
              .to(`lobby:${lobby.id}`)
              .emit('lobby:start:count:tick', 10 - count)
          },
          onEnd(lobby: LobbyState) {
            protectedNs.to(`lobby:${lobby.id}`).emit('lobby:start:count:end')

            emitLobbyState(lobby)
          },
          onAbort(lobby: LobbyState, reason: string) {
            socket.emit('lobby:start:abort', reason)

            emitLobbyState(lobby)
          },
        })
      } catch (error) {
        socket.emit('lobby:error', parseError(error).message)
      }
    })
  })

  // -_-_-_-_-_-_ GAME -_-_-_-_-_-_
  // socket.on('game:action', () => {})

  return protectedNs
}

export { registerProtectedNamespace }
