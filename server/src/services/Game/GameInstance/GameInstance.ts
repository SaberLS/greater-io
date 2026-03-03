import ms from 'ms'
import { Emitter } from '../../../utils'
import type * as Lobby from '../../Lobby'
import type { Statefull } from '../../Lobby/types/config'
import type { Config } from '../types'
import type { GameEvents, IGameInstance } from './IGameInstance'

class GameInstance<
  T extends Config.GameTypes<Config.PlayerTypes<Lobby.ILobbyUser>>,
  TState extends object,
> implements Statefull<IGameInstance<T>, TState> {
  id: number
  players: Map<T['player']['user']['id'], T['player_instance']>
  engine: T['engine_instance']
  questions: T['engine']['question'][]
  createState: (t: GameInstance<T, TState>) => TState
  #status: T['status']
  #startTimeout: ReturnType<typeof setTimeout> | undefined
  #startAt: number | undefined
  #endAt: number | undefined
  #endTimeout: ReturnType<typeof setTimeout> | undefined

  #Emitter = new Emitter<GameEvents<T>>()

  get event(): Emitter<GameEvents<T>> {
    return this.#Emitter
  }

  constructor(
    id: number,
    users: T['player']['user'][],
    engine: T['engine_instance'],
    createPlayer: (user: T['player']['user']) => T['player_instance'],
    createState: (t: GameInstance<T, TState>) => TState
  ) {
    this.createState = createState
    this.#status = 'preparing'

    this.id = id
    this.engine = engine

    this.players = new Map(
      users.map((user): [T['player']['user']['id'], T['player_instance']] => [
        user.id,
        createPlayer(user),
      ])
    )

    this.questions = this.engine.generateQuestion(10)
    this.#status = 'prepared'
  }

  get state(): TState {
    return Object.freeze(this.createState(this))
  }

  scheduleStart(delayMs: number): void {
    if (this.isScheduled) throw new Error('Game already scheduled')
    if (!this.isPrepared || !this.isReady) throw new Error("Game can't start")

    this.#status = 'scheduled'
    this.#startAt = Date.now() + delayMs

    this.#startTimeout = setTimeout((): void => {
      this.startNow()
    }, delayMs)

    this.event.emit('scheduled', { startAt: this.#startAt })
  }

  get isScheduled(): boolean {
    return this.#status === 'scheduled'
  }

  private startNow(): void {
    this.#status = 'in-progress'
    for (const player of this.players.values())
      if (player.isReady) player.status = 'in-game'

    this.#endAt = Date.now() + ms('5m')

    this.#endTimeout = setTimeout((): void => this.end(), ms('5m'))

    this.event.emit('started')
  }

  private clearTimeouts(): void {
    clearTimeout(this.#startTimeout)
    clearTimeout(this.#endTimeout)

    this.#startTimeout = undefined
    this.#endTimeout = undefined
  }

  end(): void {
    if (this.hasEnded) return

    this.clearTimeouts()
    this.#status = 'finished'
    this.event.emit('ended')
  }

  submitAnswer(
    playerId: T['player']['user']['id'],
    questionIndex: number,
    answer: T['engine']['answer'],
    context: T['engine']['context']
  ): T['engine']['answer_score'] {
    if (!this.isInProgress || this.hasEnded)
      throw new Error(`Answer can't be submitted, game is ${this.status}`)

    const player = this.players.get(playerId)
    if (!player) throw new Error(`Player is not available`)

    const question = this.questions[questionIndex]
    if (!question) throw new Error(`Question is not available`)

    const answerScore = this.engine.rateAnswer(question, answer, context)
    this.engine.reduceScore(questionIndex, player.score, answerScore)

    this.event.emit('answer', { playerId, score: answerScore })

    if (this.engine.isFinished(this.scores, this.questions)) this.end()

    return answerScore
  }

  get scores(): T['player_instance']['score'][] {
    const result = []
    for (const player of this.players.values()) result.push(player.score)

    return result
  }

  cancel(reason: string): void {
    this.clearTimeouts()
    this.#status = 'canceled'
    this.event.emit('cancel', { reason })
  }

  get leaderboard(): T['player_instance'][] {
    return [...this.players.values()].sort(
      (l, r): number => -this.engine.compareScores(l.score, r.score)
    )
  }

  get startAt(): number | undefined {
    return this.#startAt
  }
  get endAt(): number | undefined {
    return this.#endAt
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
