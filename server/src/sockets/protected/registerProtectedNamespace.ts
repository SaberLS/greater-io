import type { Namespace } from 'socket.io'
import type {
  IoAuthenticatedNamespace,
  IoAuthenticatedSocket,
} from '../../types/AuthSocket'

import { parseError } from '@greater-io/shared'
import type {
  ILobbyManager,
  LobbyID,
  LobbyMemberState,
  LobbyMemberStatus,
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
  // HACK: it works with promise
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  const protectedNs = namespace.use(socketJwtAuth) as IoAuthenticatedNamespace

  const lobbyManager: ILobbyManager<
    LobbyID,
    LobbyUserID,
    LobbyUser,
    LobbyState<LobbyUserID, LobbyUser>,
    LobbyMemberStatus
  > = new LobbyManager<
    LobbyID,
    LobbyUserID,
    LobbyUser,
    LobbyUserState<LobbyUserID, LobbyUser>,
    LobbyState<LobbyUserID, LobbyUser>,
    LobbyStatus,
    // LobbyMemberStatus,
    LobbyMemberState<LobbyUserID, LobbyUser>,
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

  const emitLobbyState = (
    lobby: LobbyState<LobbyUserID, LobbyUser>,
    room = `lobby:${lobby.id}`
  ) => protectedNs.to(room).emit('lobby:state', lobby)

  protectedNs.on('connection', socket => {
    const { user } = socket.data

    socket.on('ping', () => {
      socket.emit('secure-pong', 'secure-pong')
    })

    const listenerHandler = <TArgs extends unknown[]>(
      // TODO: add validation like validate: (...args: unknown[]) => TArgs,
      listener: (
        ...args: TArgs
      ) =>
        | (LobbyState<LobbyUserID, LobbyUser> | void)
        | Promise<LobbyState<LobbyUserID, LobbyUser> | void>,
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

      return async (...args: Partial<TArgs> | unknown[]) => {
        try {
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
          onStart(lobby: LobbyState<LobbyUserID, LobbyUser>) {
            protectedNs.to(`lobby:${lobby.id}`).emit('lobby:start:count:start')

            emitLobbyState(lobby)
          },
          onTick(count: number, lobby: LobbyState<LobbyUserID, LobbyUser>) {
            protectedNs
              .to(`lobby:${lobby.id}`)
              .emit('lobby:start:count:tick', 10 - count)
          },
          onEnd(lobby: LobbyState<LobbyUserID, LobbyUser>) {
            protectedNs.to(`lobby:${lobby.id}`).emit('lobby:start:count:end')

            emitLobbyState(lobby)
          },
          onAbort(lobby: LobbyState<LobbyUserID, LobbyUser>, reason: string) {
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
