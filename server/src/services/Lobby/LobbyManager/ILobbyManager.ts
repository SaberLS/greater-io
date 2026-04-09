import type { Config } from '../types'

interface ILobbyManager<
  T extends Config.LobbyTypes<Config.MemberTypes<Config.BASE.UserInstance>>,
  TLobby extends Config.BASE.LobbyInstance<T, Config.BASE.LobbyEvents<T>>,
> {
  create(user: T['member']['user']): TLobby
  leave(user: T['member']['user']): TLobby
  join(user: T['member']['user'], lobbyId: T['id']): TLobby

  close(lobbyId: T['id']): TLobby

  changeStatus(user: T['member']['user'], status: T['member']['status']): TLobby
}

export type { ILobbyManager }
