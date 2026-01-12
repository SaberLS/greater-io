import { failure, success } from '@greater-io/shared'
import type { ServerBundle } from '../types/serverBundle'
import { getUrl } from '../utils/getUrl'

const startServer = async (
  { httpServer, app, io }: ServerBundle,
  port?: number
) => {
  return new Promise(resolve => {
    httpServer.listen(port, () => {
      const url = getUrl(httpServer)

      success(`Server is running!`, `${url}`)
      resolve({ httpServer, app, io })
    })

    httpServer.on('error', (error_: unknown) => {
      const error =
        error_ instanceof Error ? error_ : (
          new Error('Unknown Error', {
            cause: error_,
          })
        )
      failure('Server error!', error.message)
      throw error
    })
  })
}

export { startServer }
