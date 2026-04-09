import { EventSource, type SourceOfEvents } from '../../../utils'
import type { Config } from '../types'

class LobbyMember<
  T extends Config.BASE.MemberTypes,
  TEvents extends Config.BASE.MemberEvents<T>,
  Target extends SourceOfEvents<Config.BASE.MemberInstance<T>, TEvents> =
    SourceOfEvents<Config.BASE.MemberInstance<T>, TEvents>,
>
  extends EventSource<Config.BASE.MemberEvents<T> & TEvents, Target>
  implements Config.BASE.MemberInstance<T>
{
  protected _user: T['user']
  protected _status: T['status']

  constructor(user: T['user'], status: T['status']) {
    super()

    this._user = user
    this._status = status
  }

  get id(): T['user']['id'] {
    return this.user.id
  }

  get user(): T['user'] {
    return this._user
  }

  get status(): T['status'] {
    return this._status
  }

  set status(status: T['status']) {
    if (this.status === status) return

    const prevStatus = this._status
    this._status = status

    this.emit('status-changed', {
      payload: {
        currStatus: status,
        prevStatus,
      },
    })
  }

  get isReady(): boolean {
    return this.status === 'ready'
  }
}

export { LobbyMember }
