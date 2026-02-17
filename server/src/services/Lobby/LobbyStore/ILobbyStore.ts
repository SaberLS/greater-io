import type { ILobby, ILobbyState, ILobbyUserState } from '../Lobby/ILobby'
import type {
  ILobbyMember,
  ILobbyMemberState,
  ILobbyUser,
} from '../LobbyMember'

interface ILobbyStore<
  TLobbyID extends PropertyKey,
  TUserID extends PropertyKey,
  TUser extends ILobbyUser<TUserID>,
  TUserState extends ILobbyUserState<TUserID, TUser>,
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
    TUserID,
    TUser,
    TUserState,
    TMemberStatus,
    TMemberState,
    TLobbyStatus
  >,
  TLobby extends ILobby<
    TLobbyID,
    TUserID,
    TUser,
    TUserState,
    TMemberStatus,
    TMemberState,
    TMember,
    TLobbyStatus,
    TLobbyState
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
