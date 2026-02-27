import type { ISocketUser } from '../models'
import type * as Game from './Game'
import type { IGameLobbyMember } from './Game/GameLobbyMember/IGameLobbyMember'
import type { ILobbyManager } from './Lobby/ILobbyManager'
import type { ILobbyState } from './Lobby/Lobby'
import type { ILobbyMemberState, ILobbyUserState } from './Lobby/LobbyMember'
import type { ILobbyStore } from './Lobby/LobbyStore'
import type { Config } from './Lobby/types'

type LobbyID = ReturnType<typeof crypto.randomUUID>
type LobbyUserID = ISocketUser['id']
type LobbyUser = ISocketUser
interface LobbyUserState extends ILobbyUserState {
  id: LobbyUserID
}

type LobbyMemberStatus = 'ready' | 'in-game' | 'not-ready'
type LobbyStatus = 'open' | 'closed' | 'game-in-progress' | 'starting'

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
  score: GameEngineTypes['score']
}

type GameTypes = Game.Config.GameTypes<PlayerTypes, GameEngineTypes>

interface LobbyTypes extends Game.Config.GameLobbyTypes<GameTypes> {
  id: LobbyID
  status: LobbyStatus
  member: MemberTypes
  member_instance: LobbyMember
  game: GameTypes
  player: PlayerTypes
}

type LobbyState = ILobbyState<LobbyTypes>
type Lobby = Config.Statefull<Game.IGameLobby<LobbyTypes>, LobbyState>

type LobbyStore = ILobbyStore<LobbyTypes, Lobby>
type Menager = ILobbyManager<LobbyTypes, Lobby>

export type {
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
  MemberTypes,
  Menager,
  PlayerTypes,
}
