import type { ILobby, ILobbyState, ILobbyUserState } from '../Lobby'
import type { ILobbyMemberState, ILobbyUser } from '../LobbyMember'
import type { ILobbyStore } from './ILobbyStore'

class LobbyStore<
  TLobbyID extends PropertyKey,
  TUserID extends PropertyKey,
  TUser extends ILobbyUser<TUserID>,
  TLobbyUserState extends ILobbyUserState<TUserID, TUser>,
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
  TLobbyStatus,
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
> implements ILobbyStore<
  TLobbyID,
  TUserID,
  TUser,
  TLobbyUserState,
  TLobbyStatus,
  TLobbyState,
  TLobbyMemberStatus,
  TLobbyMemberState,
  TLobby
> {
  readonly #userToLobby = new Map<TUserID, TLobby>()
  readonly #lobbies = new Map<TLobbyID, TLobby>()

  private get lobbies() {
    return this.#lobbies
  }

  hasUser(userId: TUserID): boolean {
    return this.userToLobby.has(userId)
  }

  deleteLobbyById(lobbyId: TLobbyID): void {
    this.lobbies.delete(lobbyId)
  }

  deleteUserById(userId: TUserID): void {
    this.userToLobby.delete(userId)
  }

  private get userToLobby() {
    return this.#userToLobby
  }

  getLobbyById(lobbyId: TLobbyID): TLobby | undefined {
    return this.lobbies.get(lobbyId)
  }

  getLobbyByUserId(userId: TUserID): TLobby | undefined {
    return this.userToLobby.get(userId)
  }

  addLobby(userId: TUserID, lobby: TLobby): TLobby {
    this.lobbies.set(lobby.id, lobby)
    this.addUserToLobby(userId, lobby)

    return lobby
  }

  addUserToLobby(userId: TUserID, lobby: TLobby): TLobby {
    this.userToLobby.set(userId, lobby)

    return lobby
  }
}

export { LobbyStore }
