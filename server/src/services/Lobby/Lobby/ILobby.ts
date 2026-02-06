import type { ILobbyMemberState, ILobbyUser } from '../LobbyMember'

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
    TMemberStatus,
    TMemberState,
    TLobbyStatus
  >,
  TMemberStatus,
  TMemberState extends ILobbyMemberState<TUserID, TUserState, TMemberStatus>,
> {
  id: TLobbyID
  // Members: Readonly<Map<TUserID, TLobbyMember>>
  status: TLobbyStatus
  maxMembers: number
  state: TLobbyState

  users: Iterable<TUserID>
  add(user: TUser): void
  remove(user: TUser): void

  hasUser(userId: TUserID): boolean
  isOwner(user: TUser): boolean
  isEmpty: boolean
  isFull: boolean
  isReady: boolean

  changeUserStatus(userId: TUserID, status: TMemberStatus): void

  close(): void
  start(): void
}

interface ILobbyState<
  TLobbyID extends PropertyKey,
  TUserID extends PropertyKey,
  TUser extends ILobbyUser<TUserID>,
  TUserState extends ILobbyUserState<TUserID, TUser>,
  TMemberStatus,
  TMemberState extends ILobbyMemberState<TUserID, TUserState, TMemberStatus>,
  TLobbyStatus,
> extends Readonly<{
  readonly id: TLobbyID
  readonly ownerId: TUserID | undefined
  readonly status: TLobbyStatus
  readonly maxMembers: number
  readonly currentMemberCount: number
  readonly members: Record<TUserID, TMemberState>
}> {}

export type { ILobby, ILobbyState, ILobbyUserState }
