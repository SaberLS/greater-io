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
  start(user: TUser): TLobbyState
  changeStatus(user: TUser, status: TPlayerStatus): TLobbyState
}

export type { ILobbyManager }
