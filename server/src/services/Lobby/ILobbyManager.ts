import type { ILobby } from './Lobby'
import type { ILobbyMember, ILobbyUser } from './LobbyMember'
import type { Config } from './types'

interface ILobbyManager<
  T extends Config.LobbyTypes<
    Config.BASE.LobbyID,
    Config.BASE.LobbyStatus,
    Config.Statefull<
      ILobbyMember<
        Config.MemberTypes<
          ILobbyUser<Config.BASE.UserID>,
          Config.BASE.MemberStatus
        >
      >,
      unknown
    >
  >,
  TLobby extends Config.Statefull<ILobby<T>, unknown>,
> {
  create(user: T['member']['user']): Config.Helpers.StateOf<TLobby>
  leave(user: T['member']['user']): Config.Helpers.StateOf<TLobby>
  join(
    user: T['member']['user'],
    lobbyId: T['id']
  ): Config.Helpers.StateOf<TLobby>

  close(lobbyId: T['id']): Config.Helpers.StateOf<TLobby>

  start(
    user: T['member']['user'],
    options?: Partial<{
      countFrom: number
      delay: number
      onStart: (lobby: Config.Helpers.StateOf<TLobby>) => void
      onTick: (count: number, lobby: Config.Helpers.StateOf<TLobby>) => void
      onEnd: (lobby: Config.Helpers.StateOf<TLobby>) => void
      onAbort: (lobby: Config.Helpers.StateOf<TLobby>, reason: string) => void
    }>
  ): Promise<Config.Helpers.StateOf<TLobby>>

  changeStatus(
    user: T['member']['user'],
    status: T['member']['status']
  ): Config.Helpers.StateOf<TLobby>
}

export type { ILobbyManager }
