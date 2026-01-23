import { info } from '@greater-io/shared'
import type { Namespace } from 'socket.io'
import type {
  IoAuthenticatedNamespace,
  IoAuthenticatedSocket,
} from '../../types/AuthSocket'
import { socketJwtAuth } from './socketJWTAuth'

function registerProtectedNamespace(
  namespace: Namespace
): IoAuthenticatedNamespace {
  const protectedNs = namespace.use(socketJwtAuth) as IoAuthenticatedNamespace

  protectedNs.use((socket: IoAuthenticatedSocket, next) => {
    const { user } = socket.data

    if (!user) return next(new Error('Unauthorized'))

    if (user.socketId) return next(new Error('User already connected'))

    next()
  })

  protectedNs.on('connection', (socket: IoAuthenticatedSocket) => {
    const user = socket.data.user
    user.socketId = socket.id

    socket.on('ping', () => {
      socket.emit('secure-pong', 'secure-pong')
    })

    socket.on('disconnect', () => {
      info(`Protected Socket disconnected: ${socket.id}, ${user.username}`)
      user.socketId = undefined
    })
  })

  return protectedNs as IoAuthenticatedNamespace
}

export { registerProtectedNamespace }
