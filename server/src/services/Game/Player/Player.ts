import { EventSource, type SourceOfEvents } from '../../../utils'
import type { Config } from '../types'

class Player<
  T extends Config.PlayerTypes,
  TEvents extends Config.PlayerEvents<T>,
  TMemberInstance extends Config.GameMemberInstance<T['member']>,
  Target extends SourceOfEvents<
    Config.PlayerInstance<T, TMemberInstance>,
    TEvents
  > = SourceOfEvents<Config.PlayerInstance<T, TMemberInstance>, TEvents>,
>
  extends EventSource<TEvents & Config.PlayerEvents<T>, Target>
  implements Config.PlayerInstance<T, TMemberInstance>
{
  protected _score: T['score'] = {}
  protected _status: T['status']
  protected _member: TMemberInstance

  constructor(status: T['status'], member: TMemberInstance) {
    super()
    this._status = status
    this._member = member
  }

  get score(): T['score'] {
    return this._score
  }

  get status(): T['status'] {
    return this._status
  }

  get id(): TMemberInstance['id'] {
    return this.member.id
  }

  get member(): TMemberInstance {
    return this._member
  }

  leave(): void {
    this._status = 'left'
  }

  quit(): void {
    this._status = 'quit'
  }

  get isReady(): boolean {
    return this.status === 'ready'
  }

  get isPlaying(): boolean {
    return this.status === 'in-game'
  }
}

export { Player }
