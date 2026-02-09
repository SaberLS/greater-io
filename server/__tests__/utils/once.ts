import type { Socket } from 'socket.io-client'

function once<T = unknown>(
  socket: Socket,
  event: string,
  trigger?: () => void
): Promise<T> {
  return new Promise(resolve => {
    socket.once(event, resolve)
    trigger?.()
  })
}

function waitFor(): {
  resolve: (value: void | PromiseLike<void>) => void
  reject: (reason?: unknown) => void
  promise: Promise<void>
} {
  const res: Partial<{
    resolve: (value: void | PromiseLike<void>) => void
    reject: (reason?: unknown) => void
    promise: Promise<void>
  }> = {}

  res.promise = new Promise<void>((resolve, reject) => {
    res.resolve = resolve
    res.reject = reject
  })

  return res as {
    resolve: (value: void | PromiseLike<void>) => void
    reject: (reason?: unknown) => void
    promise: Promise<void>
  }
}

export { once, waitFor }
