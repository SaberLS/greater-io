import type { Config } from '../types'

interface ILobbyUser {
  id: Config.BASE.UserID
}

interface ILobbyUserState {
  id: Config.BASE.UserID
}

interface ILobbyMember<
  T extends Config.MemberTypes,
> extends Config.MemberInstance<T> {
  isReady: boolean
}

interface ILobbyMemberState {
  user: Config.BASE.UserState
  status: Config.BASE.MemberStatus
}

export type { ILobbyMember, ILobbyMemberState, ILobbyUser, ILobbyUserState }
