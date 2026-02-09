import type { ILobbyUser } from './LobbyMember'

interface ILobbyManager<
  TLobbyID extends PropertyKey,
  TUserID extends PropertyKey,
  TUser extends ILobbyUser<TUserID>,
  TLobbyState,
  TPlayerStatus,
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
  changeStatus(user: TUser, status: TPlayerStatus): TLobbyState
}

export type { ILobbyManager }
