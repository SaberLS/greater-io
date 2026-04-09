import ms from 'ms'
import { EventSource, type SourceOfCtx } from '../../../utils'
import type { Config } from '../types'

class GameInstance<
  TData extends Config.GameTypes<Config.PlayerTypes>,
  TGameMemberCtx extends Config.GameMemberCtx<TData['player']['member']>,
  TPlayerCtx extends Config.PlayerCtx<TData['player'], TGameMemberCtx>,
  TGameCtx extends Config.GameCtx<TData, TGameMemberCtx, TPlayerCtx>,
>
  extends EventSource<
    Config.GameEvents<TData> & TGameCtx['events'],
    SourceOfCtx<TGameCtx>
  >
  implements
    Config.GameInstance<
      TData,
      SourceOfCtx<TGameMemberCtx>,
      SourceOfCtx<TPlayerCtx>
    >
{
  id: TData['id']
  players: Map<SourceOfCtx<TPlayerCtx>['id'], SourceOfCtx<TPlayerCtx>>
  engine: Config.GameEngineInstance<TData['engine']>
  problems: TData['engine']['problem'][]

  _status: TData['status']
  _startTimeout: ReturnType<typeof setTimeout> | undefined
  _startAt: number | undefined
  _endAt: number | undefined
  _endTimeout: ReturnType<typeof setTimeout> | undefined

  constructor(
    id: TData['id'],
    members: SourceOfCtx<TGameMemberCtx>[],
    engine: Config.GameEngineInstance<TData['engine']>,
    createPlayer: (
      member: SourceOfCtx<TGameMemberCtx>
    ) => SourceOfCtx<TPlayerCtx>
  ) {
    super()
    this._status = 'preparing'

    this.id = id
    this.engine = engine

    this.players = new Map(
      members.map(
        (
          member
        ): [SourceOfCtx<TGameMemberCtx>['id'], SourceOfCtx<TPlayerCtx>] => [
          member.id,
          createPlayer(member),
        ]
      )
    )

    this.problems = [...this.engine.problemGenerator.generateProblem(10)]
    this._status = 'prepared'
  }

  scheduleStart(delayMs: number): void {
    if (this.isScheduled) throw new Error('Game already scheduled')
    if (!this.isPrepared || !this.isReady) throw new Error("Game can't start")

    this._status = 'scheduled'
    this._startAt = Date.now() + delayMs

    this._startTimeout = setTimeout((): void => {
      this.startNow()
    }, delayMs)

    this.emit('scheduled', { payload: { startAt: this._startAt } })
  }

  get isScheduled(): boolean {
    return this._status === 'scheduled'
  }

  private startNow(): void {
    this._status = 'in-progress'
    for (const player of this.players.values())
      if (player.isReady) player.status = 'in-game'

    this._endAt = Date.now() + ms('5m')

    this._endTimeout = setTimeout((): void => this.end(), ms('5m'))

    this.emit('started', { payload: undefined })
  }

  private clearTimeouts(): void {
    clearTimeout(this._startTimeout)
    clearTimeout(this._endTimeout)

    this._startTimeout = undefined
    this._endTimeout = undefined
  }

  end(): void {
    if (this.hasEnded) return

    this.clearTimeouts()
    this._status = 'finished'

    this.emit('ended', { payload: undefined })
  }

  submitSolution(
    playerId: SourceOfCtx<TPlayerCtx>['id'],
    questionIndex: number,
    solution: TData['engine']['solution'],
    context: TData['engine']['context']
  ): TData['engine']['partial_score'] {
    if (!this.isInProgress || this.hasEnded)
      throw new Error(`Answer can't be submitted, game is ${this.status}`)

    const player = this.players.get(playerId)
    if (!player) throw new Error(`Player is not available`)

    const question = this.problems[questionIndex]
    if (!question) throw new Error(`Question is not available`)

    const answerScore = this.engine.solutionReviewer.rateSolution(
      question,
      solution,
      context
    )
    this.engine.solutionReviewer.reduceScore(
      questionIndex,
      player.score,
      answerScore
    )

    this.emit('answer', { payload: { playerId, score: answerScore } })

    // if (this.engine.isFinished(this.scores, this.problems)) this.end()

    return answerScore
  }

  get scores(): TData['player']['score'][] {
    const result = []
    for (const player of this.players.values()) result.push(player.score)

    return result
  }

  cancel(reason: string): void {
    this.clearTimeouts()
    this._status = 'canceled'
    this.emit('cancel', { payload: { reason } })
  }

  get leaderboard(): SourceOfCtx<TPlayerCtx>[] {
    return [...this.players.values()].sort(
      (l, r): number =>
        -this.engine.solutionReviewer.compareScores(l.score, r.score)
    )
  }

  get startAt(): number | undefined {
    return this._startAt
  }
  get endAt(): number | undefined {
    return this._endAt
  }

  get status(): TData['status'] {
    return this._status
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
