import type * as BASE from './BASE'

interface MemberTypes<TUser extends BASE.User = BASE.User> {
  user: TUser
  status: BASE.MemberStatus
}

interface MemberInstance<TMember extends MemberTypes> {
  user: TMember['user']
  status: TMember['status']
}

interface LobbyTypes<TMember extends MemberTypes = MemberTypes> {
  member: TMember
  member_instance: MemberInstance<TMember>
  id: BASE.LobbyID
  status: BASE.LobbyStatus
}

type Statefull<T extends object, TState> = T & { get state(): TState }

export type { LobbyTypes, MemberInstance, MemberTypes, Statefull }
