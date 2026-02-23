import type { Config } from '.'
import type { ISocketUser } from '../../../models'
import type { ILobbyManager } from '../ILobbyManager'
import type { ILobby, ILobbyState } from '../Lobby'
import type {
  ILobbyMember,
  ILobbyMemberState,
  ILobbyUserState,
} from '../LobbyMember'
import type { ILobbyStore } from '../LobbyStore'

type LobbyID = ReturnType<typeof crypto.randomUUID>
type LobbyUserID = ISocketUser['id']
type LobbyUser = ISocketUser
type LobbyUserState = ILobbyUserState<LobbyUser>

type LobbyMemberStatus = 'ready' | 'in-game' | 'not-ready'
type LobbyStatus = 'open' | 'closed' | 'game-in-progress' | 'starting'

type MemberTypes = Config.MemberTypes<LobbyUser, LobbyMemberStatus>
type LobbyMemberState = ILobbyMemberState<LobbyUserState, LobbyMemberStatus>

type LobbyMember = Config.Statefull<ILobbyMember<MemberTypes>, LobbyMemberState>
type LobbyTypes = Config.LobbyTypes<LobbyID, LobbyStatus, LobbyMember>

type LobbyState = ILobbyState<LobbyTypes>
type Lobby = Config.Statefull<ILobby<LobbyTypes>, LobbyState>

type LobbyStore = ILobbyStore<LobbyTypes, Lobby>
type Menager = ILobbyManager<LobbyTypes, Lobby>

export type {
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
}
