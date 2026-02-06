import type { ISocketUser, UserID } from '../../models'
import type { ILobby, ILobbyState, ILobbyUserState } from './Lobby'
import type {
  ILobbyPlayer,
  ILobbyUser,
  IPlayerResult,
  IPlayerState,
} from './LobbyPlayer'
import type { ILobbyStore } from './LobbyStore'

type LobbyID = ReturnType<typeof crypto.randomUUID>
type LobbyUserID = UserID
type LobbyUser = ISocketUser

interface LobbyUserState<
  TUserID extends PropertyKey,
  TUser extends ILobbyUser<TUserID>,
> extends ILobbyUserState<TUserID, TUser> {}

interface LobbyPlayerResult extends IPlayerResult {}
type LobbyPlayerStatus = 'ready' | 'in-game' | 'not-ready'

type LobbyPlayerState<
  TUserID extends PropertyKey,
  TUser extends ILobbyUser<TUserID>,
> = IPlayerState<
  TUserID,
  LobbyUserState<TUserID, TUser>,
  LobbyPlayerResult,
  LobbyPlayerStatus
>

type LobbyPlayerT<
  TUserID extends PropertyKey,
  TUser extends ILobbyUser<TUserID>,
> = ILobbyPlayer<
  TUserID,
  TUser,
  LobbyPlayerStatus,
  LobbyPlayerState<TUserID, TUser>,
  LobbyPlayerResult
>

type LobbyStatus =
  | 'open'
  | 'closed'
  | 'game-in-progress'
  | 'starting'
  | 'finished'

type LobbyState<
  TUserID extends PropertyKey,
  TUser extends ILobbyUser<TUserID>,
> = ILobbyState<
  LobbyID,
  TUserID,
  ILobbyUser<TUserID>,
  LobbyUserState<TUserID, TUser>,
  LobbyPlayerResult,
  LobbyPlayerStatus,
  LobbyPlayerState<TUserID, TUser>,
  LobbyStatus
>

type LobbyT<
  TUserID extends PropertyKey,
  TUser extends ILobbyUser<TUserID>,
> = ILobby<
  LobbyID,
  TUserID,
  TUser,
  LobbyUserState<TUserID, TUser>,
  LobbyStatus,
  LobbyState<TUserID, TUser>,
  LobbyPlayerStatus,
  LobbyPlayerState<TUserID, TUser>,
  LobbyPlayerResult
>

type LobbyStoreT<
  TUserID extends PropertyKey,
  TUser extends ILobbyUser<TUserID>,
> = ILobbyStore<
  LobbyID,
  TUserID,
  TUser,
  LobbyUserState<TUserID, TUser>,
  LobbyStatus,
  LobbyState<TUserID, TUser>,
  LobbyPlayerStatus,
  LobbyPlayerState<TUserID, TUser>,
  LobbyPlayerResult,
  LobbyT<TUserID, TUser>
>

export type {
  LobbyID,
  LobbyPlayerResult,
  LobbyPlayerState,
  LobbyPlayerStatus,
  LobbyPlayerT,
  LobbyState,
  LobbyStatus,
  LobbyStoreT,
  LobbyT,
  LobbyUser,
  LobbyUserID,
  LobbyUserState,
}
