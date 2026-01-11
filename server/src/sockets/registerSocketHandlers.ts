import { info } from '@greater-io/shared'
import { type Server as IoServer, type Socket } from 'socket.io'
import { Server } from '../server/instance'
import type {
  IoAuthenticatedNamespace,
  IoAuthenticatedSocket,
} from '../types/AuthSocket'
import { socketJwtAuth } from './socketJWTAuth'

const registerSocketHandlers = (io: IoServer) => {
  Server.io = io
  const protectedNs = io.of('/protected') as IoAuthenticatedNamespace

  protectedNs.use(socketJwtAuth)

  protectedNs.use((socket: IoAuthenticatedSocket, next) => {
    const user = socket.data.user
    if (!user) return next(new Error('Unauthorized'))

    if (user.socketId) return next(new Error('User already connected'))

    next()
  })

  protectedNs.on('connection', (socket: Socket) => {
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

  const publicNs = io.of('/public')

  publicNs.on('connection', socket => {
    socket.on('ping', () => {
      socket.emit('public-pong')
    })

    socket.on('disconnect', () => {
      info(`Public Socket disconnected: ${socket.id}`)
    })
  })
}

export { registerSocketHandlers }
export default registerSocketHandlers
