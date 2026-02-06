import type { Socket } from 'socket.io-client'

function once<T = any>(socket: Socket, event: string): Promise<T> {
  return new Promise(resolve => socket.once(event, resolve))
}

export { once }
