import type { LobbyUser } from '../../Lobby/types/Definition'
import type { Config } from '../types'
import type { PlayerTypes } from '../types/config'

interface IGameInstance<T extends Config.GameTypes<PlayerTypes<LobbyUser>>> {
  players: Map<T['player']['user']['id'], T['player_instance']>
  questions: T['question'][]

  // rules: T['rules']
  start(): void

  get leaderboard(): T['player_instance'][]
  get startedAt(): number

  get status(): T['status']
  get isRunning(): boolean
  get isFinished(): boolean
}

export type { IGameInstance }
