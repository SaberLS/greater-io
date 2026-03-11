import { info } from '@greater-io/shared'
import type { Namespace } from 'socket.io'

function registerPublicNamespace(namespace: Namespace): Namespace {
  namespace.on('connection', (socket): void => {
    socket.on('ping', (): void => {
      socket.emit('public-pong')
    })

    socket.on('disconnect', (): void => {
      info(`Public Socket disconnected: ${socket.id}`)
    })
  })
  return namespace
}

export { registerPublicNamespace }
