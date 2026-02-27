import type { ILobbyUser } from '../../Lobby'
import type { Config } from '../types'
import type { PlayerTypes } from '../types/config'

interface IGameInstance<T extends Config.GameTypes<PlayerTypes<ILobbyUser>>> {
  players: Map<T['player']['user']['id'], T['player_instance']>
  questions: T['engine']['question'][]

  start(): void

  submitAnswer(
    playerId: T['player']['user']['id'],
    questionIndex: number,
    answer: T['engine']['answer'],
    context: T['engine']['context']
  ): T['engine']['answer_score']

  get leaderboard(): T['player_instance'][]
  get startAt(): number

  get status(): T['status']
  get isInProgress(): boolean
  get isFinished(): boolean
}

export type { IGameInstance }
