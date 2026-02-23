import type { ILobby } from '../Lobby/ILobby'
import type { ILobbyMember, ILobbyUser } from '../LobbyMember'
import type { Config } from '../types'
import type { ILobbyStore } from './ILobbyStore'

class LobbyStore<
  T extends Config.LobbyTypes<
    Config.BASE.LobbyID,
    Config.BASE.LobbyStatus,
    Config.Statefull<
      ILobbyMember<
        Config.MemberTypes<
          ILobbyUser<Config.BASE.UserID>,
          Config.BASE.MemberStatus
        >
      >,
      Config.BASE.MemberState
    >
  >,
  TLobby extends ILobby<T>,
> implements ILobbyStore<T, TLobby> {
  readonly #userToLobby = new Map<T['member']['user']['id'], TLobby>()
  readonly #lobbies = new Map<T['id'], TLobby>()

  hasUser(userId: T['member']['user']['id']): boolean {
    return this.#userToLobby.has(userId)
  }

  deleteLobbyById(lobbyId: T['id']): void {
    this.#lobbies.delete(lobbyId)
  }

  deleteUserById(userId: T['member']['user']['id']): void {
    this.#userToLobby.delete(userId)
  }

  getLobbyById(lobbyId: T['id']): TLobby | undefined {
    return this.#lobbies.get(lobbyId)
  }

  getLobbyByUserId(userId: T['member']['user']['id']): TLobby | undefined {
    return this.#userToLobby.get(userId)
  }

  addLobby(userId: T['member']['user']['id'], lobby: TLobby): TLobby {
    this.#lobbies.set(lobby.id, lobby)
    this.addUserToLobby(userId, lobby)

    return lobby
  }

  addUserToLobby(userId: T['member']['user']['id'], lobby: TLobby): TLobby {
    this.#userToLobby.set(userId, lobby)

    return lobby
  }
}

export { LobbyStore }
