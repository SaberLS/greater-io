import type { Express } from 'express'
import { createServer as createHttpServer, Server } from 'node:http'
import type { Server as IoServer } from 'socket.io'
import { initPassport, optionsCors } from '../config'
import type { ServerBundle } from '../types/serverBundle'
import createApp from './createApp'
import { createIoServer } from './createIoServer'

const createServer = (): ServerBundle => {
  initPassport()

  const app: Express = createApp({ cors: optionsCors })
  // The error on createHttpServer(app) is just a side effect — ESLint sees that somewhere inside app there’s a promise-returning handler, and it bubbles up.
  const httpServer: Server = createHttpServer(app)
  const io: IoServer = createIoServer(httpServer, {
    cors: optionsCors,
  })

  return { app, httpServer, io }
}

export { createServer }
