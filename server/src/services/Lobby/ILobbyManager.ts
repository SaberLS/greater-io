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

  // start(
  //   user: T['member']['user']
  //   // options?: Partial<{
  //   //   countFrom: number
  //   //   delay: number
  //   //   onStart: (lobby: Config.Helpers.StateOf<TLobby>) => void
  //   //   onTick: (count: number, lobby: Config.Helpers.StateOf<TLobby>) => void
  //   //   onEnd: (lobby: Config.Helpers.StateOf<TLobby>) => void
  //   //   onAbort: (lobby: Config.Helpers.StateOf<TLobby>, reason: string) => void
  //   // }>
  // ): Config.Helpers.StateOf<TLobby>

  changeStatus(
    user: T['member']['user'],
    status: T['member']['status']
  ): Config.Helpers.StateOf<TLobby>
}

export type { ILobbyManager }
