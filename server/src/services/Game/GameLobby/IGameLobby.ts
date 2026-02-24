import type { Callbacks } from '../../../utils'
import type * as Lobby from '../../Lobby'
import type { IGameInstance } from '../GameInstance/IGameInstance'
import type { Config } from '../types'

interface IGameLobby<
  TUser extends Lobby.ILobbyUser<Lobby.Config.BASE.UserID>,
  TGame extends IGameInstance<
    Config.GameTypes<
      Config.BASE.GameID,
      Config.PlayerTypes<TUser, Config.BASE.Score>,
      Config.BASE.Question,
      Config.BASE.GameStatus
    >
  >,
  TLobby extends Lobby.Config.LobbyTypes<
    Lobby.Config.BASE.LobbyID,
    Lobby.Config.BASE.LobbyStatus,
    Lobby.ILobbyMember<
      Lobby.Config.MemberTypes<TUser, Lobby.Config.BASE.MemberStatus>
    >
  >,
> extends Lobby.ILobby<TLobby> {
  gameInstance: TGame
  // gameConfig: object

  start(callbacks: Partial<Callbacks<string>>): Promise<void>
  abortStart(reason: string): void
}

export type { IGameLobby }
