import type { JwtPayload } from 'jsonwebtoken'
import type { ExtendedError, Namespace, Socket } from 'socket.io'
import type { ISocketUser } from '../models/User/ISocketUser'

interface IoSocketData {
  user?: ISocketUser
}

interface IoSocket extends Socket {
  data: IoSocketData
  auth?: Partial<JwtPayload>
}

interface IoAuthenticatedSocket extends IoSocket {
  data: {
    user: ISocketUser
  }
  auth: JwtPayload
}

interface IoAuthenticatedNamespace extends Namespace {
  sockets: Map<string, IoAuthenticatedSocket>

  use(
    fn: (
      socket: IoAuthenticatedSocket,
      next: (err?: ExtendedError) => void
    ) => void
  ): this

  // Overload 1: authenticated socket
  on<T extends string>(
    ev: T,
    listener: (socket: IoAuthenticatedSocket) => void
  ): this
}

export type { IoAuthenticatedNamespace, IoAuthenticatedSocket }
