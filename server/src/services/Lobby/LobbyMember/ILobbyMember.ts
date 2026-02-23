import type { Config } from '../types'

interface ILobbyUser<TUserID extends Config.BASE.UserID> {
  id: TUserID
}

interface ILobbyUserState<TUser extends ILobbyUser<Config.BASE.UserID>> {
  id: TUser['id']
}

interface ILobbyMember<
  T extends Config.MemberTypes<Config.BASE.User, Config.BASE.MemberStatus>,
> {
  user: T['user']
  status: T['status']
  isReady: boolean
}

interface ILobbyMemberState<
  TUserState extends Config.BASE.UserState,
  TMemberStatus extends Config.BASE.MemberStatus,
> {
  user: TUserState
  status: TMemberStatus
}

export type { ILobbyMember, ILobbyMemberState, ILobbyUser, ILobbyUserState }
