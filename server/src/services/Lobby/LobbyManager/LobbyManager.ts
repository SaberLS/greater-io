import type { ILobbyStore } from '../LobbyStore'
import type { Config } from '../types'
import type { ILobbyManager } from './ILobbyManager'

// TODO: All methods which take an user input unknown type and be casted to desired type by some Validator
class LobbyManager<
  T extends Config.BASE.LobbyTypes,
  TLobby extends Config.BASE.LobbyInstance<T, TMember>,
  TMember extends Config.BASE.MemberInstance<T['member']>,
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

  create(user: T['member']['user']): TLobby {
    if (this.store.hasUser(user.id)) throw new Error('User already in a lobby')

    return this.store.addLobby(user.id, this.Lobby(user))
  }

  leave(user: T['member']['user']): TLobby {
    const lobby = this.store.getLobbyByUserId(user.id)

    if (lobby === undefined) throw new Error(`User is not a lobby member`)

    lobby.remove(user.id)
    this.store.deleteUserById(user.id)

    if (lobby.isEmpty) this.closeLobby(lobby)

    return lobby
  }

  join(user: T['member']['user'], lobbyId: T['id']): TLobby {
    if (this.store.hasUser(user.id)) throw new Error('User already in a lobby')

    const lobby = this.store.getLobbyById(lobbyId)

    if (lobby === undefined)
      throw new Error(`Lobby with id: ${String(lobbyId)}, is not available`)

    lobby.add(user)
    this.store.addUserToLobby(user.id, lobby)

    return lobby
  }

  close(lobbyId: T['id']): TLobby {
    const lobby = this.store.getLobbyById(lobbyId)

    if (lobby === undefined)
      throw new Error(`Lobby with id: ${String(lobbyId)}, is not available`)

    this.closeLobby(lobby)
    return lobby
  }

  // TODO: close shouldn't delete lobby it should only set lobby.status to closed to dissallow new users from joining, delete should be separate method
  private closeLobby(lobby: TLobby): TLobby {
    for (const id of lobby.members.keys()) this.store.deleteUserById(id)

    lobby.close()
    this.store.deleteLobbyById(lobby.id)

    return lobby
  }

  changeStatus(
    user: T['member']['user'],
    status: T['member']['status']
  ): TLobby {
    const lobby = this.store.getLobbyByUserId(user.id)

    if (lobby === undefined) throw new Error(`User is not a lobby member`)

    lobby.changeUserStatus(user.id, status)
    return lobby
  }
}

export { LobbyManager }
