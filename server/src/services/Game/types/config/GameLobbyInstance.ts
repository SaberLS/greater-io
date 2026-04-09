import type { SourceOfCtx } from '../../../../utils'
import type * as Lobby from '../../../Lobby'
import type { GameTypes } from './GameInstance'
import type {
  GameMemberCtx,
  GameMemberInstance,
  GameMemberTypes,
} from './GameMemberInstance'
import type { PlayerTypes } from './PlayerInstance'

type GameLobbyStatus = string

interface GameLobbyTypes extends Lobby.Config.BASE.LobbyTypes {
  readonly game: GameTypes<PlayerTypes>
  readonly member: GameMemberTypes
  readonly status: GameLobbyStatus
}

interface GameLobbyEvents<
  T extends GameLobbyTypes,
  TMemberInstance extends GameMemberInstance<T['game']['player']['member']>,
> extends Lobby.Config.BASE.LobbyEvents<T, TMemberInstance> {
  readonly 'game:scheduled': { payload: { readonly startAt: number } }
  readonly 'game:started': { payload: undefined }
  readonly 'game:ended': { payload: undefined }
  readonly 'game:cancel': { payload: { readonly reason: string } }
}

interface GameLobbyInstance<
  T extends GameLobbyTypes,
  TMemberInstance extends GameMemberInstance<T['member']>,
> extends Lobby.Config.BASE.LobbyInstance<T, TMemberInstance> {
  // gameRules: T['game']['config']
  get isReady(): boolean
  attemptStart(): void
  // abortStart(reason: string): void
}

interface GameLobbyCtx<
  TData extends GameLobbyTypes,
  TMemberCtx extends GameMemberCtx<TData['game']['player']['member']>,
> extends Lobby.LobbyCtx<TData, TMemberCtx> {
  readonly instance: GameLobbyInstance<TData, SourceOfCtx<TMemberCtx>>
  readonly events: GameLobbyEvents<TData, SourceOfCtx<TMemberCtx>>
}

export type {
  GameLobbyCtx,
  GameLobbyEvents,
  GameLobbyInstance,
  GameLobbyStatus,
  GameLobbyTypes,
}
