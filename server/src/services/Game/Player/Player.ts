import type * as Lobby from '../../Lobby'
import type { Config } from '../types'
import type { BASE } from '../types/config'
import type { IPlayer } from './IPlayer'

class Player<
  T extends Config.PlayerTypes & { score: BASE.Score },
  TState,
> implements Lobby.Config.Statefull<IPlayer<T>, TState> {
  score: T['score']
  user: T['user']
  status: T['status']
  #createState: (t: Player<T, TState>) => TState

  constructor(
    user: T['user'],
    score: T['score'],
    status: T['status'],

    createState: (t: Player<T, TState>) => TState
  ) {
    this.score = score
    this.user = user
    this.status = status

    this.#createState = createState
  }

  leave(): void {
    this.status = 'left'
  }

  quit(): void {
    this.status = 'quit'
  }

  get state(): TState {
    return Object.freeze(this.#createState(this))
  }

  get isReady(): boolean {
    return this.status === 'ready'
  }
  get isPlaying(): boolean {
    return this.status === 'in-game'
  }
}

export { Player }
