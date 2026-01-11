import type { CorsOptions } from 'cors'
import { type Server as HttpServer } from 'node:http'
import { Server } from 'socket.io'
import registerSocketHandlers from '../sockets/registerSocketHandlers'

const createIoServer = (
  httpServer: HttpServer,
  options: CreateSocketOptions
) => {
  const io = new Server(httpServer, {
    cors: options.cors,
  })

  registerSocketHandlers(io)

  return io
}

interface CreateSocketOptions {
  cors: CorsOptions
}

export { createIoServer }
