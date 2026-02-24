import type * as Lobby from '../../Lobby'
import type { Config } from '../types'

interface IGameInstance<
  T extends Config.GameTypes<
    Config.BASE.GameID,
    Config.PlayerTypes<
      Lobby.ILobbyUser<Lobby.Config.BASE.UserID>,
      Config.BASE.Score
    >,
    Config.BASE.Question,
    Config.BASE.GameStatus
  >,
> {
  players: Map<T['player']['user']['id'], T['player']>
  questions: T['question'][]

  status: T['status']
  get isRunning(): boolean
  get isFinished(): boolean
}

export type { IGameInstance }
