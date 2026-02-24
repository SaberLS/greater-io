import type * as Lobby from '../../../Lobby'
import type * as BASE from './BASE'

interface PlayerTypes<
  TUser extends Lobby.Config.BASE.User,
  TScore extends BASE.Score,
> {
  user: TUser
  score: TScore
}

interface GameTypes<
  TGameID extends BASE.GameID,
  TPlayer extends PlayerTypes<Lobby.Config.BASE.User, BASE.Score>,
  TQuestion extends BASE.Question,
  TStatus extends BASE.GameStatus,
> {
  id: TGameID
  player: TPlayer
  question: TQuestion
  status: TStatus
}

export type { GameTypes, PlayerTypes }
