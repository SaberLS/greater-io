import type * as Lobby from '../../Lobby'
import type { Config } from '../types'

interface IGameLobby<
  T extends Config.GameLobbyTypes<
    Config.GameTypes<Config.PlayerTypes<Lobby.ILobbyUser>>
  >,
> extends Lobby.ILobby<T> {
  gameInstance: T['game_instance'] | undefined

  get isReady(): boolean
  // gameConfig: T['game']['config']

  start(): Promise<void>
  // abortStart(reason: string): void
}

export type { IGameLobby }
