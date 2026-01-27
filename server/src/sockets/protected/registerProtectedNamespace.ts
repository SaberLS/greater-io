import type { Namespace } from 'socket.io'
import { Lobby } from '../../services/LobbyManager/Lobby/Lobby'
import type {
  IoAuthenticatedNamespace,
  IoAuthenticatedSocket,
} from '../../types/AuthSocket'

import { parseError } from '@greater-io/shared'
import type { ISocketUser } from '../../models'
import { LobbyManager } from '../../services/LobbyManager/LobbyManager'
import { socketJwtAuth } from './socketJWTAuth'

function registerProtectedNamespace(
  namespace: Namespace
): IoAuthenticatedNamespace {
  const protectedNs = namespace.use(socketJwtAuth) as IoAuthenticatedNamespace

  const lobbyManager = new LobbyManager()

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

    socket.on('lobby:create', () => {
      const { lobbyId } = socket.data
      if (lobbyId) {
        socket.emit('error', 'Already in lobby')
        return
      }

      const lobby = new Lobby(user)
      lobbyManager.add(lobby.id, lobby)

      // associate lobby with socket
      socket.data.lobbyId = lobby.id

      // join socket.io room for this lobby
      socket.join(`lobby:${lobby.id}`)

      // emit initial state
      protectedNs.to(`lobby:${lobby.id}`).emit('lobby:state', lobby.state)
    })

    socket.on('lobby:join', lobbyId => {
      if (socket.data.lobbyId) {
        socket.emit('lobby:error', 'Already in lobby')
        return
      }

      const lobby = lobbyManager.get(lobbyId)

      if (!lobby) {
        socket.emit('lobby:error', `Lobby ${lobbyId} is not available`)
        return
      }

      try {
        lobby.add(user)

        socket.join(`lobby:${lobbyId}`)
        socket.data.lobbyId = lobbyId

        protectedNs.to(`lobby:${lobbyId}`).emit('lobby:state', lobby.state)
      } catch (_e: unknown) {
        const error = parseError(_e)

        socket.emit('lobby:error', error.message)
      }
    })

    const leaveLobby = (
      user: ISocketUser,
      lobby: Lobby,
      { silent = false }: { silent?: boolean } = {}
    ) => {
      try {
        lobby.leave(user)

        socket.leave(`lobby:${lobby.id}`)
        socket.data.lobbyId = undefined

        if (lobby.players.size === 0) {
          lobbyManager.delete(lobby.id)

          protectedNs.to(`lobby:${lobby.id}`).emit('lobby:closed')
        } else
          protectedNs.to(`lobby:${lobby.id}`).emit('lobby:state', lobby.state)
      } catch (_e: unknown) {
        const error = parseError(_e)

        if (!silent) socket.emit('lobby:error', error.message)
      }
    }

    socket.on('lobby:leave', () => {
      const { lobbyId } = socket.data

      if (lobbyId) {
        const lobby = lobbyManager.get(lobbyId)

        if (lobby) {
          leaveLobby(user, lobby)
          protectedNs.to(`lobby:${lobbyId}`).emit('lobby:state', lobby.state)
        } else socket.emit('lobby:error', `Lobby ${lobbyId} is not available`)
      } else socket.emit('lobby:error', `User ${user.id} is not a lobby member`)
    })

    // socket.on('lobby:ready', () => {})
    // socket.on('lobby:start', () => {})

    socket.on('disconnect', () => {
      const { lobbyId } = socket.data
      if (lobbyId) {
        const lobby = lobbyManager.get(lobbyId)

        if (lobby) leaveLobby(user, lobby, { silent: true })
      }
    })
  })

  return protectedNs as IoAuthenticatedNamespace
}

export { registerProtectedNamespace }
