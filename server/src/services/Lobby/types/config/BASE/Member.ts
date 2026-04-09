import { type EventMap } from '../../../../../utils'
import type { UserInstance } from './User'

type MemberStatus = Readonly<string>
type MemberState = Readonly<object>

interface MemberTypes {
  readonly user: UserInstance
  readonly status: MemberStatus
}

interface MemberEvents<TMember extends MemberTypes> extends EventMap {
  'status-changed': {
    payload: {
      prevStatus: TMember['status']
      currStatus: TMember['status']
    }
  }
}

interface MemberInstance<T extends MemberTypes> {
  get user(): T['user']
  get status(): T['status']
  set status(status: T['status'])
  get id(): T['user']['id']
}

export type {
  MemberEvents,
  MemberInstance,
  MemberState,
  MemberStatus,
  MemberTypes,
}
