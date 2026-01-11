import type { ServerBundle } from '../types/serverBundle'

const closeServer = (bundle: ServerBundle) =>
  new Promise<void>(resolve => {
    bundle.io.close()
    bundle.httpServer.close(() => resolve())
  })
export { closeServer }
