// interface IPlayerResult {
//   score: number
// }

interface ILobbyMemberState<
  TUserID extends PropertyKey,
  TUser extends ILobbyUser<TUserID>,
  TStatus,
> {
  user: TUser
  status: TStatus
}

interface ILobbyUser<TUserID extends PropertyKey> {
  id: TUserID
  username: string
}

interface ILobbyMember<
  TUserID extends PropertyKey,
  TUser extends ILobbyUser<TUserID>,
  TMemberStatus,
  TLobbyMemberState extends ILobbyMemberState<
    TUserID,
    ILobbyUser<TUserID>,
    TMemberStatus
  >,
> {
  user: TUser
  state: TLobbyMemberState
  status: TMemberStatus
  isReady: boolean
}

export type { ILobbyMember, ILobbyMemberState, ILobbyUser }
