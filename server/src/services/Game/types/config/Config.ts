import type * as Lobby from '../../../Lobby'
import type * as BASE from './BASE'

interface PlayerTypes<
  TUser extends Lobby.Config.BASE.User = Lobby.Config.BASE.User,
> extends Lobby.Config.MemberTypes<TUser> {
  score: BASE.Score
}

interface PlayerInstance<T extends PlayerTypes> extends Lobby.Config
  .MemberInstance<T> {
  score: T['score']
}

interface GameTypes<TPlayer extends PlayerTypes = PlayerTypes> {
  id: BASE.GameID
  player: TPlayer
  player_instance: PlayerInstance<TPlayer>
  question: BASE.Question
  status: BASE.GameStatus
}

interface GameInstance<TGame extends GameTypes> {
  id: TGame['id']
  questions: TGame['question']
  status: TGame['status']
}

interface GameLobbyTypes<TGame extends GameTypes = GameTypes> extends Lobby
  .Config.LobbyTypes<TGame['player']> {
  game: TGame
  game_instance: GameInstance<TGame>
  status: BASE.GameLobbyStatus
}

export type {
  GameInstance,
  GameLobbyTypes,
  GameTypes,
  PlayerInstance,
  PlayerTypes,
}
