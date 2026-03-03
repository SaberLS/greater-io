import type { Emitts } from '../../../utils'
import type { ILobbyUser } from '../../Lobby'
import type { Config } from '../types'
import type { PlayerTypes } from '../types/config'

interface IGameInstance<
  T extends Config.GameTypes<PlayerTypes<ILobbyUser>>,
> extends Emitts<GameEvents<T>> {
  players: Map<T['player']['user']['id'], T['player_instance']>
  questions: T['engine']['question'][]

  submitAnswer(
    playerId: T['player']['user']['id'],
    questionIndex: number,
    answer: T['engine']['answer'],
    context: T['engine']['context']
  ): T['engine']['answer_score']

  scheduleStart(delayMs: number): void

  get leaderboard(): T['player_instance'][]
  get startAt(): number | undefined
  get endAt(): number | undefined

  get status(): T['status']
  get isInProgress(): boolean
  get isFinished(): boolean
}

interface GameEvents<
  T extends Config.GameTypes<Config.PlayerTypes<ILobbyUser>>,
> {
  scheduled: { startAt: number }
  started: void
  ended: void
  cancel: { reason: string }
  answer: {
    playerId: T['player']['user']['id']
    score: T['engine']['answer_score']
  }
}

export type { GameEvents, IGameInstance }
