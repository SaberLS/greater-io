interface IPlayerResult {
  score: number
}

interface IPlayerState<
  TUserID extends PropertyKey,
  TUser extends ILobbyUser<TUserID>,
  TResult,
  TStatus,
> {
  user: TUser
  result: TResult
  status: TStatus
}

interface ILobbyUser<TUserID extends PropertyKey> {
  id: TUserID
  username: string
}

interface ILobbyPlayer<
  TUserID extends PropertyKey,
  TUser extends ILobbyUser<TUserID>,
  TPlayerStatus,
  TPlayerState extends IPlayerState<
    TUserID,
    ILobbyUser<TUserID>,
    TPlayerResult,
    TPlayerStatus
  >,
  TPlayerResult extends IPlayerResult,
> {
  user: TUser
  state: TPlayerState
  result: TPlayerResult
  status: TPlayerStatus
  isReady: boolean
}

export type { ILobbyPlayer, ILobbyUser, IPlayerResult, IPlayerState }
