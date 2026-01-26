import type { JwtPayload } from 'jsonwebtoken'
import type {
  DefaultEventsMap,
  ExtendedError,
  Namespace,
  Socket,
} from 'socket.io'
import type { ISocketUser } from '../models/User/ISocketUser'
import type { LobbyID } from '../services/LobbyManager/Lobby/Lobby'

type IoAuthenticatedUser = Omit<ISocketUser, 'socketId'> & { socketId?: string }

interface IoAuthData {
  user?: IoAuthenticatedUser
}

interface IoSocketBeforeAuth extends Socket<
  DefaultEventsMap,
  DefaultEventsMap,
  DefaultEventsMap,
  IoAuthData
> {
  handshake: Socket['handshake'] & {
    auth?: Partial<JwtPayload>
  }
}

interface IoAuthenticatedSocket extends Omit<IoSocketBeforeAuth, 'data'> {
  data: {
    user: IoAuthenticatedUser
  }
  handshake: Socket['handshake'] & {
    auth: JwtPayload
  }
}

interface IoAuthenticatedUserSocket extends Socket<
  AuthenticatedEventsMap,
  AuthenticatedEventsMap,
  AuthenticatedEventsMap,
  {
    user: ISocketUser
    lobbyId: LobbyID
  }
> {
  data: {
    user: ISocketUser
    lobbyId: LobbyID
  }
  handshake: Socket['handshake'] & {
    auth: JwtPayload
  }
}

interface LobbyUser extends IoAuthenticatedUserSocket {}

interface AuthenticatedEventsMap extends DefaultEventsMap {
  connection: (socket: IoAuthenticatedUserSocket) => void
  'lobby:create': () => void
}

interface IoAuthenticatedNamespace extends Namespace<
  AuthenticatedEventsMap,
  AuthenticatedEventsMap,
  AuthenticatedEventsMap,
  {
    user: ISocketUser
    lobbyId: LobbyID
  }
> {
  sockets: Map<string, IoAuthenticatedUserSocket>

  use(
    fn: (
      socket: IoAuthenticatedUserSocket,
      next: (err?: ExtendedError) => void
    ) => void
  ): this

  // Overload 1: authenticated socket
  on<T extends string>(
    ev: T,
    listener: (socket: IoAuthenticatedUserSocket) => void
  ): this
}

export type {
  IoAuthenticatedNamespace,
  IoAuthenticatedSocket,
  IoAuthenticatedUserSocket,
  IoSocketBeforeAuth,
}
