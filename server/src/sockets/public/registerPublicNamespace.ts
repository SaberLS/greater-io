import { info } from '@greater-io/shared'
import type { Namespace } from 'socket.io'

function registerPublicNamespace(namespace: Namespace) {
  namespace.on('connection', socket => {
    socket.on('ping', () => {
      socket.emit('public-pong')
    })

    socket.on('disconnect', () => {
      info(`Public Socket disconnected: ${socket.id}`)
    })
  })
  return namespace
}

export { registerPublicNamespace }
