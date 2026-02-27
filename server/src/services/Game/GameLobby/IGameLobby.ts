import type * as Lobby from '../../Lobby'
import type { Config } from '../types'

interface IGameLobby<
  T extends Config.GameLobbyTypes<
    Config.GameTypes<Config.PlayerTypes<Lobby.ILobbyUser>>
  >,
> extends Lobby.ILobby<T> {
  gameInstance: T['game_instance'] | undefined
  // gameConfig: T['game']['config']

  get isReady(): boolean

  start(): void
  // abortStart(reason: string): void
}

export type { IGameLobby }
