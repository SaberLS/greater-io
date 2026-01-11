import { warn } from '@greater-io/shared'
import type { Server } from 'node:http'

const getUrl = (httpServer: Server) => {
  const address = httpServer.address()

  let url: string
  if (address && typeof address === 'object') {
    // AddressInfo
    const host = address.address === '::' ? 'localhost' : address.address
    url = `http://${host}:${address.port}`
  } else if (typeof address === 'string') {
    // UNIX socket path
    url = address
  } else {
    url = 'null'
    warn('url is null')
  }
  return url
}

export { getUrl }
