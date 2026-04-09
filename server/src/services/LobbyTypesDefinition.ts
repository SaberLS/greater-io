import type { ISocketUser } from '../models'
import type * as Game from './Game'
import type { IGameLobbyMember } from './Game/GameLobbyMember/IGameLobbyMember'
import type { ILobbyState } from './Lobby/Lobby'
import type { ILobbyMemberState, ILobbyUserState } from './Lobby/LobbyMember'
import type { ILobbyStore } from './Lobby/LobbyStore'
import type { Config } from './Lobby/types'
import type { Statefull } from './Lobby/types/config'

type LobbyID = ReturnType<typeof crypto.randomUUID>
type LobbyUserID = ISocketUser['id']
type LobbyUser = ISocketUser
interface LobbyUserState extends ILobbyUserState {
  id: LobbyUserID
  username: string
}

type LobbyMemberStatus = 'ready' | 'in-game' | 'not-ready'
type LobbyStatus = 'open' | 'closed' | 'game-in-progress' | 'creating-game'

type MemberTypes = Config.MemberTypes<LobbyUser>
interface LobbyMemberState extends ILobbyMemberState {
  user: LobbyUserState
  status: LobbyMemberStatus
}

type LobbyMember = Config.Statefull<
  IGameLobbyMember<MemberTypes>,
  LobbyMemberState
>

type GameEngineTypes = Game.BaseGameEnigneTypes

type PlayerTypes = Game.Config.PlayerTypes<LobbyUser> & {
  score: GameEngineTypes['total_score']
}
interface PlayerState {
  user: {
    id: PlayerTypes['user']['id']
    username: PlayerTypes['user']['username']
  }
  score: PlayerTypes['score']
  status: PlayerTypes['status']
}

type Player = Statefull<Game.IPlayer<PlayerTypes>, PlayerState>

interface GameTypes extends Game.Config.GameTypes<
  PlayerTypes,
  GameEngineTypes
> {
  player_instance: Player
}

interface LobbyTypes extends Game.Config.GameLobbyTypes<GameTypes> {
  id: LobbyID
  status: LobbyStatus
  member: MemberTypes
  member_instance: LobbyMember
  game: GameTypes
  player: PlayerTypes
  player_instance: Player
}

type LobbyState = ILobbyState<LobbyTypes>

interface GameState {
  leaderboard: GameTypes['player']['user']['id'][]
  status: GameTypes['status']
  questions: Game.MathQuestion['task'][]
  players: Record<GameTypes['player']['user']['id'], PlayerState>
}

type Lobby = Config.Statefull<Game.IGameLobby<LobbyTypes>, LobbyState>

type LobbyStore = ILobbyStore<LobbyTypes, Lobby>
type Manager = Game.IGameLobbyManager<LobbyTypes, Lobby>

export type {
  GameState,
  GameTypes,
  Lobby,
  LobbyID,
  LobbyMember,
  LobbyMemberState,
  LobbyMemberStatus,
  LobbyState,
  LobbyStatus,
  LobbyStore,
  LobbyTypes,
  LobbyUser,
  LobbyUserID,
  LobbyUserState,
  Manager,
  MemberTypes,
  Player,
  PlayerState,
  PlayerTypes,
}
