import type { ILobbyUser } from './LobbyPlayer'

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
  changeStatus(user: TUser, status: TPlayerStatus): TLobbyState
}

export type { ILobbyManager }
