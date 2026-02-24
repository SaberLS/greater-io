import type * as BASE from './BASE'

interface MemberTypes<
  TUser extends BASE.User,
  TMemberStatus extends BASE.MemberStatus,
> {
  user: TUser
  status: TMemberStatus
}

interface LobbyTypes<
  TLobbyID extends BASE.LobbyID,
  TLobbyStatus extends BASE.LobbyStatus,
  TMember extends MemberTypes<BASE.User, BASE.MemberStatus>,
> {
  member: TMember
  id: TLobbyID
  status: TLobbyStatus
}

type Statefull<T extends object, TState> = T & { get state(): TState }

export type { LobbyTypes, MemberTypes, Statefull }
