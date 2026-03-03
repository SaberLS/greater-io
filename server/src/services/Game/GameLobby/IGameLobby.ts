import type { Emitts } from '../../../utils'
import type * as Lobby from '../../Lobby'
import type { Config } from '../types'

interface GameLobbyEvents {
  'game:scheduled': { startAt: number }
  'game:started': void
  'game:ended': void
  'game:canceled': { reason: string }
  'game:answer': object
}

interface IGameLobby<
  T extends Config.GameLobbyTypes<
    Config.GameTypes<Config.PlayerTypes<Lobby.ILobbyUser>>
  >,
>
  extends Lobby.ILobby<T>, Emitts<GameLobbyEvents> {
  gameInstance: T['game_instance'] | undefined
  // gameConfig: T['game']['config']

  get isReady(): boolean

  createGame(): void
  // abortStart(reason: string): void
}

export type { GameLobbyEvents, IGameLobby }
