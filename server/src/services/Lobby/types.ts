import type { ISocketUser, UserID } from '../../models'
import type { ILobby, ILobbyState, ILobbyUserState } from './Lobby'
import type { ILobbyMember, ILobbyMemberState, ILobbyUser } from './LobbyMember'
import type { ILobbyStore } from './LobbyStore'

type LobbyID = ReturnType<typeof crypto.randomUUID>
type LobbyUserID = UserID
type LobbyUser = ISocketUser

type LobbyUserState<
  TUserID extends PropertyKey,
  TUser extends ILobbyUser<TUserID>,
> = ILobbyUserState<TUserID, TUser>

// interface LobbyPlayerResult extends IPlayerResult {}
type LobbyMemberStatus = 'ready' | 'in-game' | 'not-ready'

type LobbyMemberState<
  TUserID extends PropertyKey,
  TUser extends ILobbyUser<TUserID>,
> = ILobbyMemberState<
  TUserID,
  LobbyUserState<TUserID, TUser>,
  LobbyMemberStatus
>

type LobbyMemberT<
  TUserID extends PropertyKey,
  TUser extends ILobbyUser<TUserID>,
> = ILobbyMember<
  TUserID,
  TUser,
  LobbyMemberStatus,
  LobbyMemberState<TUserID, TUser>
>

type LobbyStatus = 'open' | 'closed' | 'game-in-progress' | 'starting'

type LobbyState<
  TUserID extends PropertyKey,
  TUser extends ILobbyUser<TUserID>,
> = ILobbyState<
  LobbyID,
  TUserID,
  ILobbyUser<TUserID>,
  LobbyUserState<TUserID, TUser>,
  LobbyMemberStatus,
  LobbyMemberState<TUserID, TUser>,
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
  LobbyMemberStatus,
  LobbyMemberState<TUserID, TUser>
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
  LobbyMemberStatus,
  LobbyMemberState<TUserID, TUser>,
  LobbyT<TUserID, TUser>
>

export type {
  LobbyID,
  // LobbyPlayerResult,
  LobbyMemberState,
  LobbyMemberStatus,
  LobbyMemberT,
  LobbyState,
  LobbyStatus,
  LobbyStoreT,
  LobbyT,
  LobbyUser,
  LobbyUserID,
  LobbyUserState,
}
