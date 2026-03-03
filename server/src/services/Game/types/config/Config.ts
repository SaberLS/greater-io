import type * as Lobby from '../../../Lobby'
import type { IGameEngine } from '../../GameEngine/IGameEngine'
import type { IGameInstance } from '../../GameInstance'
import type { IGameLobbyMember } from '../../GameLobbyMember/IGameLobbyMember'
import type * as BASE from './BASE'

// TODO: Player shouldn't be a member
interface PlayerTypes<
  TUser extends Lobby.Config.BASE.User = Lobby.Config.BASE.User,
> extends Lobby.Config.MemberTypes<TUser> {
  score: BASE.Score
}

interface PlayerInstance<T extends PlayerTypes> extends Lobby.Config
  .MemberInstance<T> {
  score: T['score']
  isReady: boolean
}

interface GameEngineTypes {
  context: BASE.Context
  answer_score: BASE.AnswerScore
  answer: BASE.Answer
  score: BASE.Score
  question: BASE.Question
  total_score: BASE.TotalScore
}

interface GameTypes<
  TPlayer extends PlayerTypes = PlayerTypes,
  TEngine extends GameEngineTypes = GameEngineTypes,
> {
  id: BASE.GameID
  player: TPlayer
  player_instance: PlayerInstance<TPlayer> & { score: TEngine['score'] }
  status: BASE.GameStatus
  engine: TEngine
  engine_instance: IGameEngine<TEngine>
}

interface GameInstance<TGame extends GameTypes> {
  id: TGame['id']
  questions: TGame['engine']['question'][]
  status: TGame['status']

  get isFinished(): boolean
}

interface GameLobbyTypes<
  TGame extends GameTypes<PlayerTypes<Lobby.ILobbyUser>> = GameTypes<
    PlayerTypes<Lobby.ILobbyUser>
  >,
> extends Lobby.Config.LobbyTypes<Omit<TGame['player'], 'score'>> {
  game: TGame
  game_instance: Lobby.Config.Statefull<IGameInstance<TGame>, object>
  status: BASE.GameLobbyStatus
  member_instance: IGameLobbyMember<TGame['player']>
}

export type {
  GameEngineTypes,
  GameInstance,
  GameLobbyTypes,
  GameTypes,
  PlayerInstance,
  PlayerTypes,
}
