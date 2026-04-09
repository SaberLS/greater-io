import { LobbyMember } from '../../Lobby'
import type { Config } from '../../Lobby/types'

class GameLobbyMember<T extends Config.BASE.MemberTypes> extends LobbyMember<
  T,
  Config.BASE.MemberEvents<T>
> {
  get isReady(): boolean {
    return this.status === 'ready'
  }
}

export { GameLobbyMember }
