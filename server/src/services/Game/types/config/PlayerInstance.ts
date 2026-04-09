import {
  type EventMap,
  type SourceCtx,
  type SourceOfCtx,
} from '../../../../utils'
import type { TotalScore } from './GameEngineInstance'
import type {
  GameMemberCtx,
  GameMemberEvents,
  GameMemberInstance,
  GameMemberTypes,
} from './GameMemberInstance'

type PlayerStatus = string

interface PlayerTypes {
  readonly member: GameMemberTypes
  readonly status: PlayerStatus
  readonly score: TotalScore
}

type GameMemberEventsOfPlayer<TPlayer extends PlayerTypes> = GameMemberEvents<
  TPlayer['member']
>

interface PlayerEvents<T extends PlayerTypes> extends EventMap {
  readonly 'status-changed': [
    {
      payload: {
        readonly prevStatus: T['status']
        readonly currStatus: T['status']
      }
    },
  ]
}

type PlayerEventsOfPlayer<TPlayer extends PlayerTypes> = PlayerEvents<TPlayer>

interface PlayerInstance<
  T extends PlayerTypes,
  TMemberInstance extends GameMemberInstance<T['member']>,
> {
  get member(): TMemberInstance
  get score(): T['score']
  set status(newStatus: T['status'])
  get status(): T['status']

  leave(): void // temporal disconnect, user still can rejoin
  quit(): void // user left completely can't rejoin

  get id(): TMemberInstance['id']
  get isReady(): boolean
  get isPlaying(): boolean
}

interface PlayerCtx<
  TData extends PlayerTypes,
  TGameMemberCtx extends GameMemberCtx<TData['member']>,
> extends SourceCtx {
  readonly instance: PlayerInstance<TData, SourceOfCtx<TGameMemberCtx>>
  readonly events: GameMemberEvents<TData['member']>
}

export type {
  GameMemberEventsOfPlayer,
  PlayerCtx,
  PlayerEvents,
  PlayerEventsOfPlayer,
  PlayerInstance,
  PlayerStatus,
  PlayerTypes,
}
