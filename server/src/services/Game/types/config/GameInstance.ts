import type { EventMap, SourceCtx, SourceOfCtx } from '../../../../utils'
import type { GameEngineTypes } from './GameEngineInstance'
import type { GameMemberCtx, GameMemberInstance } from './GameMemberInstance'
import type { PlayerCtx, PlayerInstance, PlayerTypes } from './PlayerInstance'

type GameStatus = string
type GameID = PropertyKey

interface GameTypes<TPlayer extends PlayerTypes> {
  readonly id: GameID
  readonly player: TPlayer
  readonly engine: GameEngineTypes & { total_score: TPlayer['score'] }
  readonly status: GameStatus
}

interface GameEvents<T extends GameTypes<PlayerTypes>> extends EventMap {
  readonly scheduled: { payload: { readonly startAt: number } }
  readonly started: { payload: undefined }
  readonly ended: { payload: undefined }
  readonly cancel: { payload: { readonly reason: string } }
  readonly answer: {
    payload: {
      readonly playerId: T['player']['member']['user']['id']
      readonly score: T['player']['score']
    }
  }
}

interface GameInstance<
  T extends GameTypes<PlayerTypes>,
  TMemberInstance extends GameMemberInstance<T['player']['member']>,
  TPlayerInstance extends PlayerInstance<T['player'], TMemberInstance>,
> {
  get players(): Map<TPlayerInstance['id'], TPlayerInstance>
  get problems(): T['engine']['problem'][]

  submitSolution(
    playerId: TPlayerInstance['id'],
    questionIndex: number,
    answer: T['engine']['solution'],
    context: T['engine']['context']
  ): T['engine']['partial_score']

  scheduleStart(delayMs: number): void

  get leaderboard(): TPlayerInstance[]
  get startAt(): number | undefined
  get endAt(): number | undefined

  get status(): T['status']
  get isInProgress(): boolean
  get isFinished(): boolean
}

interface GameCtx<
  TData extends GameTypes<PlayerTypes>,
  TMember extends GameMemberCtx<TData['player']['member']>,
  TPlayer extends PlayerCtx<TData['player'], TMember>,
> extends SourceCtx {
  readonly instance: GameInstance<
    TData,
    SourceOfCtx<TMember>,
    SourceOfCtx<TPlayer>
  >
  readonly events: GameEvents<TData>
}

export type { GameCtx, GameEvents, GameID, GameInstance, GameStatus, GameTypes }
