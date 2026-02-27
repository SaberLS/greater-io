import type { ILobbyStore, ILobbyUser } from '../../Lobby'
import { LobbyManager } from '../../Lobby/LobbyManager'
import type { Statefull } from '../../Lobby/types/config'
import type { IGameLobby } from '../GameLobby/IGameLobby'
import type { Config } from '../types'

class GameLobbyManager<
  T extends Config.GameLobbyTypes<
    Config.GameTypes<Config.PlayerTypes<ILobbyUser>>
  >,
  TLobby extends Statefull<IGameLobby<T>, object>,
  TLobbyStore extends ILobbyStore<T, TLobby>,
> extends LobbyManager<T, TLobby, TLobbyStore> {
  //
}

export { GameLobbyManager }
