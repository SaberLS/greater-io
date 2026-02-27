import type * as Lobby from '../../Lobby'
import type { Config } from '../types'
import type { IGameInstance } from './IGameInstance'

class GameInstance<
  T extends Config.GameTypes<Config.PlayerTypes<Lobby.ILobbyUser>>,
> implements IGameInstance<T> {
  id: number
  players: Map<T['player']['user']['id'], T['player_instance']>
  engine: T['engine_instance']
  questions: T['engine']['question'][]
  #status: T['status']
  #startAt: number

  constructor(
    id: number,
    users: T['player']['user'][],
    engine: T['engine_instance'],
    createPlayer: (user: T['player']['user']) => T['player_instance']
  ) {
    this.id = id
    this.#status = 'preparing'
    this.engine = engine

    this.players = new Map(
      users.map((user): [T['player']['user']['id'], T['player_instance']] => [
        user.id,
        createPlayer(user),
      ])
    )

    this.#startAt = Date.now()
    this.questions = this.engine.generateQuestion(10)

    this.#status = 'prepared'
  }

  submitAnswer(
    playerId: T['player']['user']['id'],
    questionIndex: number,
    answer: T['engine']['answer'],
    context: T['engine']['context']
  ): T['engine']['answer_score'] {
    if (!this.isInProgress)
      throw new Error(`Answer can't be submitted, game is ${this.status}`)

    const player = this.players.get(playerId)
    if (!player) throw new Error(`Player is not available`)

    const question = this.questions[questionIndex]
    if (!question) throw new Error(`Question is not available`)

    const answerScore = this.engine.rateAnswer(question, answer, context)
    this.engine.reduceScore(questionIndex, player.score, answerScore)

    return answerScore
  }

  start(): void {
    if (!this.isPrepared)
      throw new Error(`Game can't be started. Game is ${this.status}`)
    if (!this.isReady)
      throw new Error(`Game can't be started. Not all players are ready.`)

    this.#status = 'in-progress'
  }

  get leaderboard(): T['player_instance'][] {
    return [...this.players.values()].sort((l, r): number =>
      this.engine.compareScores(l.score, r.score)
    )
  }

  get startAt(): number {
    return this.#startAt
  }

  get status(): T['status'] {
    return this.#status
  }

  get isReady(): boolean {
    for (const player of this.players.values())
      if (!player.isReady) return false

    return true
  }

  get isPrepared(): boolean {
    return this.status === 'prepared'
  }

  get isPreparing(): boolean {
    return this.status === 'preparing'
  }

  get isInProgress(): boolean {
    return this.status === 'in-progress'
  }

  get isFinished(): boolean {
    return this.status === 'finished'
  }

  get isCancelled(): boolean {
    return this.status === 'canceled'
  }

  get hasEnded(): boolean {
    return this.isFinished || this.isCancelled
  }
}

export { GameInstance }
