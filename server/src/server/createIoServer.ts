import type { CorsOptions } from 'cors'
import { type Server as HttpServer } from 'node:http'
import { Server as IoServer } from 'socket.io'
import { Server } from '../server/instance'
import { registerProtectedNamespace, registerPublicNamespace } from '../sockets'

const createIoServer = (
  httpServer: HttpServer,
  options: CreateSocketOptions
) => {
  Server.io = new IoServer(httpServer, {
    cors: options.cors,
  })

  registerProtectedNamespace(Server.io.of('/protected'))
  registerPublicNamespace(Server.io.of('/public'))

  return Server.io
}

interface CreateSocketOptions {
  cors: CorsOptions
}

export { createIoServer }
