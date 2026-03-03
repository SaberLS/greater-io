import type { ILobby, LobbyBaseTypes } from './Lobby'
import type { Config } from './types'

interface ILobbyManager<
  T extends LobbyBaseTypes,
  TLobby extends Config.Statefull<ILobby<T>, Config.BASE.LobbyState>,
> {
  create(user: T['member']['user']): Config.Helpers.StateOf<TLobby>
  leave(user: T['member']['user']): Config.Helpers.StateOf<TLobby>
  join(
    user: T['member']['user'],
    lobbyId: T['id']
  ): Config.Helpers.StateOf<TLobby>

  close(lobbyId: T['id']): Config.Helpers.StateOf<TLobby>

  changeStatus(
    user: T['member']['user'],
    status: T['member']['status']
  ): Config.Helpers.StateOf<TLobby>
}

export type { ILobbyManager }
