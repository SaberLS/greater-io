import type { ExtendedError, Namespace, Socket } from 'socket.io'
import type { IUser } from '../models/User/User'

interface IoSocketUser extends Partial<IUser> {
  socketId?: string
}

interface IoSocketData {
  user?: IoSocketUser
}

interface JwtPayload {
  sub: number
}

interface IoSocket extends Socket {
  data: IoSocketData
  auth?: Partial<JwtPayload>
}

interface IoAuthenticatedSocket extends IoSocket {
  data: {
    user: IoSocketUser
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

export type { IoAuthenticatedNamespace, IoAuthenticatedSocket, JwtPayload }
