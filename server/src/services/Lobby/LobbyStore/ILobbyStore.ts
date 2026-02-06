import type { ILobby, ILobbyState, ILobbyUserState } from '../Lobby/ILobby'
import type { ILobbyMemberState, ILobbyUser } from '../LobbyMember'

interface ILobbyStore<
  TLobbyID extends PropertyKey,
  TUserID extends PropertyKey,
  TUser extends ILobbyUser<TUserID>,
  TLobbyUserState extends ILobbyUserState<TUserID, TUser>,
  TLobbyStatus,
  TLobbyState extends ILobbyState<
    TLobbyID,
    TUserID,
    TUser,
    TLobbyUserState,
    TLobbyMemberStatus,
    TLobbyMemberState,
    TLobbyStatus
  >,
  // ---
  TLobbyMemberStatus,
  TLobbyMemberState extends ILobbyMemberState<
    TUserID,
    TLobbyUserState,
    TLobbyMemberStatus
  >,
  TLobby extends ILobby<
    TLobbyID,
    TUserID,
    TUser,
    TLobbyUserState,
    TLobbyStatus,
    TLobbyState,
    TLobbyMemberStatus,
    TLobbyMemberState
  >,
> {
  deleteUserById(userId: TUserID): void
  deleteLobbyById(lobbyId: TLobbyID): void

  getLobbyById(lobbyId: TLobbyID): TLobby | undefined
  getLobbyByUserId(userId: TUserID): TLobby | undefined
  hasUser(userId: TUserID): boolean

  addLobby(userId: TUserID, lobby: TLobby): TLobby
  addUserToLobby(userId: TUserID, lobby: TLobby): TLobby
}

export type { ILobbyStore }
