import type { ILobbyManager } from './ILobbyManager'
import { Lobby, type LobbyID } from './Lobby/Lobby'
import type { IPlayer } from './Player/IPlayer'

class LobbyManager implements ILobbyManager<LobbyID, number, IPlayer, Lobby> {
  store = new Map<LobbyID, Lobby>()

  get size() {
    return this.store.size
  }

  add(key: LobbyID, lobby: Lobby): void {
    this.store.set(key, lobby)
  }

  get(key: LobbyID): Lobby | undefined {
    return this.store.get(key)
  }

  has(key: LobbyID): boolean {
    return this.store.has(key)
  }

  clear(): void {
    this.store.clear()
  }

  delete(key: LobbyID): boolean {
    return this.store.delete(key)
  }
}

export { LobbyManager }
