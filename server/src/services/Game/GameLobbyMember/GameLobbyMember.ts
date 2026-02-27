import { LobbyMember } from '../../Lobby'
import type { Config } from '../../Lobby/types'
import type { IGameLobbyMember } from './IGameLobbyMember'

class GameLobbyMember<T extends Config.MemberTypes, TState>
  extends LobbyMember<T, TState>
  implements IGameLobbyMember<T>
{
  get isReady(): boolean {
    return this.status === 'ready'
  }
}

export { GameLobbyMember }
