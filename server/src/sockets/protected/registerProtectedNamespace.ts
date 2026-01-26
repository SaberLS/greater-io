import type { Namespace } from 'socket.io'
import { Lobby } from '../../services/LobbyManager/Lobby/Lobby'
import type {
  IoAuthenticatedNamespace,
  IoAuthenticatedSocket,
} from '../../types/AuthSocket'

import { parseError } from '@greater-io/shared'
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
    const user = socket.data.user

    socket.on('ping', () => {
      socket.emit('secure-pong', 'secure-pong')
    })

    socket.on('lobby:create', () => {
      if (socket.data.lobbyId) {
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

    // socket.on('lobby:leave', () => {})
    // socket.on('lobby:ready', () => {})
    // socket.on('lobby:start', () => {})

    socket.on('disconnect', () => {
      // cleanup later
    })
  })

  return protectedNs as IoAuthenticatedNamespace
}

export { registerProtectedNamespace }
