import { parseError } from '@greater-io/shared'
import type { Namespace } from 'socket.io'
import { Lobby, LobbyMember } from '../../services'
import { LobbyManager } from '../../services/Lobby/LobbyManager'
import { LobbyStore } from '../../services/Lobby/LobbyStore'

import { Definition } from '../../services/Lobby/types'
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

  const createMemberState = (
    member: LobbyMember<Definition.MemberTypes, Definition.LobbyMemberState>
  ): Definition.LobbyMemberState => ({
    user: { id: member.user.id },
    status: member.status,
  })

  const createMember = (user: Definition.LobbyUser): Definition.LobbyMember =>
    new LobbyMember<Definition.MemberTypes, Definition.LobbyMemberState>(
      user,
      createMemberState,
      'in-game'
    )

  const createLobbyState = (
    lobby: Lobby<Definition.LobbyTypes, Definition.LobbyState>
  ): Definition.LobbyState => ({
    id: lobby.id,
    ownerId: lobby.owner?.id,
    status: lobby.status,
    maxMembers: lobby.maxMembers,
    currentMemberCount: lobby.membersSize,
    members: lobby.membersState,
  })

  const createLobby = (user: Definition.LobbyUser): Definition.Lobby =>
    new Lobby<Definition.LobbyTypes, Definition.LobbyState>(
      crypto.randomUUID(),
      user,
      createMember,
      createLobbyState
    )

  const store = new LobbyStore<Definition.LobbyTypes, Definition.Lobby>()
  const lobbyManager: Definition.Menager = new LobbyManager<
    Definition.LobbyTypes,
    Definition.Lobby,
    Definition.LobbyStore
  >(createLobby, store)
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

    socket.on('lobby:start', async (): Promise<void> => {
      try {
        await lobbyManager.start(user, {
          onStart(lobby): void {
            protectedNs.to(`lobby:${lobby.id}`).emit('lobby:start:count:start')

            emitLobbyState(lobby)
          },
          onTick(count, lobby): void {
            protectedNs
              .to(`lobby:${lobby.id}`)
              .emit('lobby:start:count:tick', 10 - count)
          },
          onEnd(lobby): void {
            protectedNs.to(`lobby:${lobby.id}`).emit('lobby:start:count:end')

            emitLobbyState(lobby)
          },
          onAbort(lobby, reason): void {
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
