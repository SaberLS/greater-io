import { failure, info, Logger, parseError } from '@greater-io/shared'
import { createServer, startServer } from './server'
import { closeServer } from './server/closeServer'

interface Config {
  port?: number
  silent: boolean
  isProd: boolean
}

const defaultConfig: Config = {
  port: undefined,
  silent: false,
  isProd: false,
}

const main = async (config?: Partial<Config>) => {
  const {
    isProd = defaultConfig.isProd,
    silent = defaultConfig.silent,
    port = defaultConfig.port,
  } = config ?? {}

  Logger.setProductionMode(isProd)
  Logger.setSilentMode(silent)
  try {
    const bundle = createServer()
    await startServer(bundle, port)

    // Graceful shutdown
    const close = async () => {
      info('Shutting down...')
      await closeServer(bundle)
      process.exit(0)
    }

    if (process.listenerCount('SIGINT') === 0) {
      process.on('SIGINT', close)
      process.on('SIGTERM', close)
    }

    return bundle
  } catch (error_: unknown) {
    const error = parseError(error_)
    failure('On server startup!', error.message)
    throw error
  }
}

export { main, type Config }
