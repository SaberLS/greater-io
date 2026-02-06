import type { ILobbyManager } from './ILobbyManager'
import type { ILobby, ILobbyState, ILobbyUserState } from './Lobby/ILobby'
import type { ILobbyMemberState, ILobbyUser } from './LobbyMember'
import type { ILobbyStore } from './LobbyStore'
import type { LobbyMemberStatus } from './types'

// TODO: All methods which take an user input unknown type and be casted to desired type by some Validator
class LobbyManager<
  TLobbyID extends PropertyKey,
  TUserID extends PropertyKey,
  TUser extends ILobbyUser<TUserID>,
  TLobbyUserState extends ILobbyUserState<TUserID, TUser>,
  TLobbyState extends ILobbyState<
    TLobbyID,
    TUserID,
    TUser,
    TLobbyUserState,
    LobbyMemberStatus,
    TLobbyMemberState,
    TLobbyStatus
  >,
  // ---
  TLobbyStatus,
  // TLobbyMemberStatus,
  TLobbyMemberState extends ILobbyMemberState<
    TUserID,
    TLobbyUserState,
    LobbyMemberStatus
  >,
  TLobby extends ILobby<
    TLobbyID,
    TUserID,
    TUser,
    TLobbyUserState,
    TLobbyStatus,
    TLobbyState,
    LobbyMemberStatus,
    TLobbyMemberState
  >,
  TLobbyStore extends ILobbyStore<
    TLobbyID,
    TUserID,
    TUser,
    TLobbyUserState,
    TLobbyStatus,
    TLobbyState,
    LobbyMemberStatus,
    TLobbyMemberState,
    TLobby
  >,
> implements ILobbyManager<
  TLobbyID,
  TUserID,
  TUser,
  TLobbyState,
  LobbyMemberStatus
> {
  private readonly Lobby: new (user: TUser) => TLobby
  private readonly store: TLobbyStore

  constructor(Lobby: new (user: TUser) => TLobby, store: TLobbyStore) {
    this.Lobby = Lobby
    this.store = store
  }

  create(user: TUser): TLobbyState {
    if (this.store.hasUser(user.id)) throw new Error('User already in a lobby')

    return this.store.addLobby(user.id, new this.Lobby(user)).state
  }

  leave(user: TUser): TLobbyState {
    const lobby = this.store.getLobbyByUserId(user.id)

    if (lobby === undefined) throw new Error(`User is not a lobby member`)

    lobby.remove(user)
    this.store.deleteUserById(user.id)

    if (lobby.isEmpty) this.closeLobby(lobby)

    return lobby.state
  }

  join(user: TUser, lobbyId: TLobbyID): TLobbyState {
    if (this.store.hasUser(user.id)) throw new Error('User already in a lobby')

    const lobby = this.store.getLobbyById(lobbyId)

    if (lobby === undefined)
      throw new Error(`Lobby with id: ${String(lobbyId)}, is not available`)
    if (lobby.hasUser(user.id)) throw new Error('User already in a lobby')
    if (lobby.isFull) throw new Error('Lobby is full')

    lobby.add(user)
    this.store.addUserToLobby(user.id, lobby)

    return lobby.state
  }

  close(lobbyId: TLobbyID) {
    const lobby = this.store.getLobbyById(lobbyId)

    if (lobby === undefined)
      throw new Error(`Lobby with id: ${String(lobbyId)}, is not available`)

    return this.closeLobby(lobby)
  }

  // TODO: close shouldn't delete lobby it should only set lobby.status to closed to dissallow new users from joining, delete should be separate method
  private closeLobby(lobby: TLobby) {
    for (const userId of lobby.users) this.store.deleteUserById(userId)

    lobby.close()
    this.store.deleteLobbyById(lobby.id)

    return lobby.state
  }

  changeStatus(user: TUser, status: LobbyMemberStatus): TLobbyState {
    const lobby = this.store.getLobbyByUserId(user.id)

    if (lobby === undefined || !lobby.hasUser(user.id))
      throw new Error(`User is not a lobby member`)

    lobby.changeUserStatus(user.id, status)
    return lobby.state
  }

  start(user: TUser): TLobbyState {
    const lobby = this.store.getLobbyByUserId(user.id)

    if (lobby === undefined)
      throw new Error(`User with id: ${String(user.id)}, is not a lobby member`)
    if (!lobby.isOwner(user))
      throw new Error(
        `User with id: ${String(user.id)}, is not an owner of lobby: ${String(lobby.id)}`
      )
    if (!lobby.isReady) throw new Error(`Not all lobby members are ready`)

    lobby.start()
    return lobby.state
  }
}

export { LobbyManager }
