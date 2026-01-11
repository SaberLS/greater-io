import type { Express } from 'express'
import type { Server as IoServer } from 'socket.io'

// TODO: I need this for now to close all user sessions when user logs out, but the static instance should be deleted, the server bundle should be passed to createApp so it later can pass it down to logoutController
class Server {
  static io: IoServer
  static app: Express
}

export { Server }
