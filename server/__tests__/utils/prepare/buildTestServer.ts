import { main, type Config } from '@greater-io/server/src/main'
import { closeServer } from '@greater-io/server/src/server'
import type { ServerBundle } from '@greater-io/server/src/types/serverBundle'
import { getUrl } from '@greater-io/server/src/utils/getUrl'

type TestServer = {
  bundle: ServerBundle
  url: string
  init: () => Promise<void>
  close: () => Promise<void>
}

const buildTestServer = (
  config: Partial<Config> = { isProd: false, silent: true }
): TestServer => {
  let bundle: ServerBundle | undefined
  let url: string | undefined

  const init = async () => {
    if (bundle) throw new Error('Server already initialized')

    bundle = await main(config)
    url = getUrl(bundle.httpServer)
  }

  const close = async () => {
    if (!bundle) {
      throw new Error('Server not initialized. Call init() first.')
    }
    await closeServer(bundle)
  }

  const server: TestServer = {
    init,
    close,
    get bundle() {
      if (!bundle) throw new Error('Server not initialized')
      return bundle
    },
    get url() {
      if (!url) throw new Error('Server not initialized')
      return url
    },
  }

  return server
}

export { buildTestServer }
