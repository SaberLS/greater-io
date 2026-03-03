import type { ILobbyManager } from './ILobbyManager'
import type { ILobby, LobbyBaseTypes } from './Lobby'
import type { ILobbyStore } from './LobbyStore'
import type { Config } from './types'

// TODO: All methods which take an user input unknown type and be casted to desired type by some Validator
class LobbyManager<
  T extends LobbyBaseTypes,
  TLobby extends Config.Statefull<ILobby<T>, Config.BASE.LobbyState>,
  TLobbyStore extends ILobbyStore<T, TLobby>,
> implements ILobbyManager<T, TLobby> {
  private readonly Lobby: (user: T['member']['user']) => TLobby
  readonly store: TLobbyStore

  constructor(
    Lobby: (user: T['member']['user']) => TLobby,
    store: TLobbyStore
  ) {
    this.Lobby = Lobby
    this.store = store
  }

  create(user: T['member']['user']): Config.Helpers.StateOf<TLobby> {
    if (this.store.hasUser(user.id)) throw new Error('User already in a lobby')

    return this.store.addLobby(user.id, this.Lobby(user)).state
  }

  leave(user: T['member']['user']): Config.Helpers.StateOf<TLobby> {
    const lobby = this.store.getLobbyByUserId(user.id)

    if (lobby === undefined) throw new Error(`User is not a lobby member`)

    lobby.remove(user)
    this.store.deleteUserById(user.id)

    if (lobby.isEmpty) this.closeLobby(lobby)

    return lobby.state
  }

  join(
    user: T['member']['user'],
    lobbyId: T['id']
  ): Config.Helpers.StateOf<TLobby> {
    if (this.store.hasUser(user.id)) throw new Error('User already in a lobby')

    const lobby = this.store.getLobbyById(lobbyId)

    if (lobby === undefined)
      throw new Error(`Lobby with id: ${String(lobbyId)}, is not available`)

    lobby.add(user)
    this.store.addUserToLobby(user.id, lobby)

    return lobby.state
  }

  close(lobbyId: T['id']): TLobby['state'] {
    const lobby = this.store.getLobbyById(lobbyId)

    if (lobby === undefined)
      throw new Error(`Lobby with id: ${String(lobbyId)}, is not available`)

    this.closeLobby(lobby)
    return lobby.state
  }

  // TODO: close shouldn't delete lobby it should only set lobby.status to closed to dissallow new users from joining, delete should be separate method
  private closeLobby(lobby: TLobby): TLobby['state'] {
    for (const id of lobby.members.keys()) this.store.deleteUserById(id)

    lobby.close()
    this.store.deleteLobbyById(lobby.id)

    return lobby.state
  }

  changeStatus(
    user: T['member']['user'],
    status: T['member']['status']
  ): TLobby['state'] {
    const lobby = this.store.getLobbyByUserId(user.id)

    if (lobby === undefined) throw new Error(`User is not a lobby member`)

    lobby.changeUserStatus(user.id, status)
    return lobby.state
  }
}

export { LobbyManager }
