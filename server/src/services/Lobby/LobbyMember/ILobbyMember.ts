import type { Config } from '../types'

interface ILobbyUser {
  id: Config.BASE.UserID
}

interface ILobbyUserState {
  id: Config.BASE.UserID
}

interface ILobbyMemberState {
  user: Config.BASE.UserState
  status: Config.BASE.MemberStatus
}

export type { ILobbyMemberState, ILobbyUser, ILobbyUserState }
