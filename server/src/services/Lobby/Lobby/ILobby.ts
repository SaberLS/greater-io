import type { ILobbyUser, IPlayerResult, IPlayerState } from '../LobbyPlayer'

interface ILobbyUserState<
  TUserID extends PropertyKey,
  TUser extends ILobbyUser<TUserID>,
> extends Readonly<{}> {
  readonly id: TUser['id']
  readonly username: TUser['username']
}

interface ILobby<
  TLobbyID extends PropertyKey,
  TUserID extends PropertyKey,
  TUser extends ILobbyUser<TUserID>,
  TUserState extends ILobbyUserState<TUserID, TUser>,
  TLobbyStatus,
  TLobbyState extends ILobbyState<
    TLobbyID,
    TUserID,
    TUser,
    TUserState,
    TPlayerResult,
    TPlayerStatus,
    TPlayerState,
    TLobbyStatus
  >,
  TPlayerStatus,
  TPlayerState extends IPlayerState<
    TUserID,
    TUserState,
    TPlayerResult,
    TPlayerStatus
  >,
  TPlayerResult extends IPlayerResult,
> {
  id: TLobbyID
  // players: Readonly<Map<TUserID, TLobbyPlayer>>
  status: TLobbyStatus
  maxPlayers: number
  state: TLobbyState
  isEmpty: boolean
  isFull: boolean

  users: Iterable<TUserID>

  add(user: TUser): void
  hasUser(userId: TUserID): boolean

  changeUserStatus(userId: TUserID, status: TPlayerStatus): void
  remove(user: TUser): void
  close(): void
}

interface ILobbyState<
  TLobbyID extends PropertyKey,
  TUserID extends PropertyKey,
  TUser extends ILobbyUser<TUserID>,
  TUserState extends ILobbyUserState<TUserID, TUser>,
  TPlayerResult extends IPlayerResult,
  TPlayerStatus,
  TPlayerState extends IPlayerState<
    TUserID,
    TUserState,
    TPlayerResult,
    TPlayerStatus
  >,
  TLobbyStatus,
> extends Readonly<{
  readonly id: TLobbyID
  readonly ownerId: TUserID | undefined
  readonly status: TLobbyStatus
  readonly maxPlayers: number
  readonly currentPlayerCount: number
  readonly players: Record<TUserID, TPlayerState>
}> {}

export type { ILobby, ILobbyState, ILobbyUserState }
