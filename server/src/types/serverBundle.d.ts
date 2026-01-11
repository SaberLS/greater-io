import type { Express } from 'express'
import type { Server as httpServer } from 'node:http'
import type { Server as IoServer } from 'socket.io'

interface ServerBundle {
  httpServer: httpServer
  app: Express
  io: IoServer
}
