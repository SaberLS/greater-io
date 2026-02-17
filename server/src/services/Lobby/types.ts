import type { ISocketUser } from '../../models'
import type { ILobby, ILobbyState, ILobbyUserState } from './Lobby'
import type { ILobbyMember, ILobbyMemberState } from './LobbyMember'
import type { ILobbyStore } from './LobbyStore'

type LobbyID = ReturnType<typeof crypto.randomUUID>
type LobbyUserID = ISocketUser['id']
type LobbyUser = ISocketUser

type LobbyUserState = ILobbyUserState<LobbyUserID, LobbyUser>

type LobbyMemberStatus = 'ready' | 'in-game' | 'not-ready'
type LobbyMemberState = ILobbyMemberState<
  LobbyUserID,
  LobbyUserState,
  LobbyMemberStatus
>

type LobbyMemberT = ILobbyMember<
  LobbyUserID,
  LobbyUser,
  LobbyUserState,
  LobbyMemberStatus,
  LobbyMemberState
>

type LobbyStatus = 'open' | 'closed' | 'game-in-progress' | 'starting'

type LobbyState = ILobbyState<
  LobbyID,
  LobbyUserID,
  LobbyUser,
  LobbyUserState,
  LobbyMemberStatus,
  LobbyMemberState,
  LobbyStatus
>

type LobbyT = ILobby<
  LobbyID,
  LobbyUserID,
  LobbyUser,
  LobbyUserState,
  LobbyMemberStatus,
  LobbyMemberState,
  LobbyMemberT,
  LobbyStatus,
  LobbyState
>

type LobbyStoreT = ILobbyStore<
  LobbyID,
  LobbyUserID,
  LobbyUser,
  LobbyUserState,
  LobbyMemberStatus,
  LobbyMemberState,
  LobbyMemberT,
  LobbyStatus,
  LobbyState,
  LobbyT
>

export type {
  LobbyID,
  LobbyMemberState,
  LobbyMemberStatus,
  LobbyMemberT,
  LobbyState,
  LobbyStatus,
  LobbyStoreT,
  LobbyT,
  LobbyUser,
  LobbyUserID,
  LobbyUserState,
}
