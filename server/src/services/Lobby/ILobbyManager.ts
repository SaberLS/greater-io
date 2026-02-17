import type { ILobbyState, ILobbyUserState } from './Lobby'
import type { ILobbyMember, ILobbyMemberState, ILobbyUser } from './LobbyMember'

interface ILobbyManager<
  TLobbyID extends PropertyKey,
  TUserID extends PropertyKey,
  TUser extends ILobbyUser<TUserID>,
  TUserState extends ILobbyUserState<TUserID, TUser>,
  TMemberStatus,
  TMemberState extends ILobbyMemberState<TUserID, TUserState, TMemberStatus>,
  TMember extends ILobbyMember<
    TUserID,
    TUser,
    TUserState,
    TMemberStatus,
    TMemberState
  >,
  TLobbyStatus,
  TLobbyState extends ILobbyState<
    TLobbyID,
    TUserID,
    TUser,
    TUserState,
    TMemberStatus,
    TMemberState,
    TLobbyStatus
  >,
> {
  create(user: TUser): TLobbyState
  leave(user: TUser): TLobbyState
  join(user: TUser, lobbyId: TLobbyID): TLobbyState
  close(lobbyId: TLobbyID): TLobbyState
  start(
    user: TUser,
    options?: Partial<{
      countFrom: number
      delay: number
      onStart: (lobby: TLobbyState) => void
      onTick: (count: number, lobby: TLobbyState) => void
      onEnd: (lobby: TLobbyState) => void
      onAbort: (lobby: TLobbyState, reason: string) => void
    }>
  ): Promise<TLobbyState>

  changeStatus(user: TUser, status: TMember['status']): TLobbyState
}

export type { ILobbyManager }
