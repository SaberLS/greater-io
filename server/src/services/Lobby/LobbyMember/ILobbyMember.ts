import type { ILobbyUserState } from '../Lobby/ILobby'

interface ILobbyMemberState<
  TUserID extends PropertyKey,
  TUserState extends ILobbyUserState<TUserID>,
  TStatus,
> {
  user: TUserState
  status: TStatus
}

interface ILobbyUser<TUserID extends PropertyKey> {
  id: TUserID
  username: string
}

interface ILobbyMember<
  TUserID extends PropertyKey,
  TUser extends ILobbyUser<TUserID>,
  TUserState extends ILobbyUserState<TUserID>,
  TMemberStatus,
  TMemberState extends ILobbyMemberState<TUserID, TUserState, TMemberStatus>,
> {
  user: TUser
  state: Readonly<TMemberState>
  status: TMemberStatus
  isReady: boolean
}

export type { ILobbyMember, ILobbyMemberState, ILobbyUser }
