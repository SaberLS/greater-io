import type { Namespace } from 'socket.io'
import type {
  IoAuthenticatedNamespace,
  IoAuthenticatedSocket,
} from '../../types/AuthSocket'

import { parseError } from '@greater-io/shared'
import type {
  ILobbyManager,
  LobbyID,
  LobbyPlayerResult,
  LobbyPlayerState,
  LobbyPlayerStatus,
  LobbyState,
  LobbyStatus,
  LobbyStoreT,
  LobbyT,
  LobbyUser,
  LobbyUserID,
  LobbyUserState,
} from '../../services'
import { Lobby } from '../../services'
import { LobbyManager } from '../../services/Lobby/LobbyManager'
import { LobbyStore } from '../../services/Lobby/LobbyStore'
import { socketJwtAuth } from './socketJWTAuth'

function registerProtectedNamespace(
  namespace: Namespace
): IoAuthenticatedNamespace {
  const protectedNs = namespace.use(socketJwtAuth) as IoAuthenticatedNamespace

  const lobbyManager: ILobbyManager<
    LobbyID,
    LobbyUserID,
    LobbyUser,
    LobbyState<LobbyUserID, LobbyUser>,
    LobbyPlayerStatus
  > = new LobbyManager<
    LobbyID,
    LobbyUserID,
    LobbyUser,
    LobbyUserState<LobbyUserID, LobbyUser>,
    LobbyState<LobbyUserID, LobbyUser>,
    LobbyStatus,
    // LobbyPlayerStatus,
    LobbyPlayerState<LobbyUserID, LobbyUser>,
    LobbyPlayerResult,
    LobbyT<LobbyUserID, LobbyUser>,
    LobbyStoreT<LobbyUserID, LobbyUser>
  >(Lobby, new LobbyStore())

  // check if user exists and if user is already connected
  protectedNs.use((socket: IoAuthenticatedSocket, next) => {
    const { user } = socket.data

    if (!user) return next(new Error('Unauthorized'))

    if (user.socketId) return next(new Error('User already connected'))

    user.socketId = socket.id
    next()
  })

  protectedNs.on('connection', socket => {
    const { user } = socket.data

    socket.on('ping', () => {
      socket.emit('secure-pong', 'secure-pong')
    })

    const listenerHandler = <TArgs extends unknown[]>(
      // TODO: add validation like validate: (...args: unknown[]) => TArgs,
      listener: (...args: TArgs) => LobbyState<LobbyUserID, LobbyUser> | void,
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

      return (...args: Partial<TArgs> | unknown[]) => {
        try {
          const lobby = listener(...args /* should be validate(...args) */)

          if (opt.emitState && lobby)
            protectedNs.to(`lobby:${lobby.id}`).emit('lobby:state', lobby)
        } catch (e) {
          if (opt.emitError) socket.emit('lobby:error', parseError(e).message)
        }
      }
    }

    const leaveLobbySafely = (reason: 'leave' | 'disconnect') => {
      try {
        const lobby = lobbyManager.leave(socket.data.user)
        const lobbyRoom = `lobby:${lobby.id}`
        socket.leave(lobbyRoom)

        protectedNs.to(lobbyRoom).emit('lobby:state', lobby)
      } catch (e) {
        if (reason === 'leave')
          socket.emit('lobby:error', parseError(e).message)
      } finally {
        socket.data.lobbyId = undefined
      }
    }

    socket.on(
      'lobby:create',
      listenerHandler(() => {
        const lobby = lobbyManager.create(socket.data.user)

        socket.data.lobbyId = lobby.id
        socket.join(`lobby:${lobby.id}`)

        return lobby
      })
    )

    socket.on(
      'lobby:join',
      listenerHandler<[lobbyId: LobbyID]>(lobbyId => {
        const lobby = lobbyManager.join(user, lobbyId)

        socket.join(`lobby:${lobby.id}`)
        socket.data.lobbyId = lobby.id

        return lobby
      })
    )

    socket.on('lobby:leave', () => {
      leaveLobbySafely('leave')
    })

    socket.on('disconnect', () => {
      leaveLobbySafely('disconnect')

      // @ts-expect-error clear the socket on user disconnection
      delete user.socketId
    })

    socket.on(
      'lobby:status',
      listenerHandler<[status: LobbyPlayerStatus]>(
        (status: LobbyPlayerStatus) => lobbyManager.changeStatus(user, status)
      )
    )

    socket.on(
      'lobby:start',
      listenerHandler(() => lobbyManager.start(user))
    )
  })

  return protectedNs as IoAuthenticatedNamespace
}

export { registerProtectedNamespace }
