import type { Config } from '../types'
import type { ILobbyMember } from './ILobbyMember'

class LobbyMember<
  T extends Config.MemberTypes,
  TState,
> implements Config.Statefull<ILobbyMember<T>, TState> {
  #user: T['user']
  #status: T['status']

  #createState: (t: LobbyMember<T, TState>) => TState

  constructor(
    user: T['user'],
    createState: (t: LobbyMember<T, TState>) => TState,
    status: T['status']
  ) {
    this.#user = user
    this.#status = status
    this.#createState = createState
  }

  get user(): T['user'] {
    return this.#user
  }

  get state(): Readonly<TState> {
    return Object.freeze(this.#createState(this))
  }

  get status(): T['status'] {
    return this.#status
  }

  set status(status: T['status']) {
    this.#status = status
  }

  get isReady(): boolean {
    return this.status === 'ready'
  }
}

export { LobbyMember }
