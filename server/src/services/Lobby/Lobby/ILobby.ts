import type { Callbacks } from '../../../utils'
import type {
  ILobbyMember,
  ILobbyMemberState,
  ILobbyUser,
} from '../LobbyMember'

interface ILobbyUserState<TUserID extends PropertyKey> {
  id: TUserID
  username: string
}

interface ILobby<
  TLobbyID extends PropertyKey,
  TUserID extends PropertyKey,
  TUser extends ILobbyUser<TUserID>,
  TUserState extends ILobbyUserState<TUserID>,
  TMemberStatus,
  TMemberState extends ILobbyMemberState<TUserID, TUserState, TMemberStatus>,
  TMember extends ILobbyMember<
    TUserID,
    TUser,
    TUserState,
    TMemberStatus,
    TMemberState
  >,
  TLobbyStatus,
  TLobbyState extends ILobbyState<
    TLobbyID,
    TUser,
    TUserState,
    TMemberStatus,
    TMemberState,
    TLobbyStatus,
    TUserID
  >,
> {
  id: TLobbyID

  status: TLobbyStatus
  maxMembers: number

  state: Readonly<TLobbyState> // optionally include GameState
  members: Readonly<Map<TUserID, TMember>>

  // game_instance: Game // game object itself

  add(user: TUser): void
  remove(user: TUser): void

  hasUser(userId: TUserID): boolean
  isOwner(user: TUser): boolean
  isEmpty: boolean
  isFull: boolean
  isReady: boolean

  changeUserStatus(userId: TUserID, status: TMemberStatus): void

  close(): void

  start(callbacks: Partial<Callbacks<string>>): Promise<void>
  abortStart(reason: string): void
  counterState: number
}

interface LobbyStartCallbacks<TAbortReason, TLobbyState> {
  onStart: (lobby: TLobbyState) => void
  onTick: (count: number, lobby: TLobbyState) => void
  onEnd: (lobby: TLobbyState) => void
  onAbort: (lobby: TLobbyState, reason: TAbortReason) => void
}

interface ILobbyState<
  TLobbyID extends PropertyKey,
  TUser extends ILobbyUser<TUserID>,
  TUserState extends ILobbyUserState<TUserID>,
  TMemberStatus,
  TMemberState extends ILobbyMemberState<TUserID, TUserState, TMemberStatus>,
  TLobbyStatus,
  TUserID extends PropertyKey = TUser['id'],
> {
  id: TLobbyID
  ownerId: TUserID | undefined
  status: TLobbyStatus
  maxMembers: number
  currentMemberCount: number
  members: Readonly<Record<TUserID, TMemberState>>
}

export type { ILobby, ILobbyState, ILobbyUserState, LobbyStartCallbacks }
