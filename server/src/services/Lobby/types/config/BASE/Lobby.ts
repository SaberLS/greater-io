import type { EventMap } from '../../../../../utils'
import type { MemberInstance, MemberTypes } from './Member'

type LobbyID = Readonly<PropertyKey>
type LobbyStatus = Readonly<string>
type LobbyState = Readonly<object>

interface LobbyTypes {
  readonly member: MemberTypes
  readonly id: LobbyID
  readonly status: LobbyStatus
}

interface LobbyEvents<
  T extends LobbyTypes,
  TMemberInstance extends MemberInstance<T['member']>,
> extends EventMap {
  'member:status-changed': {
    payload: {
      member: TMemberInstance
      prevStatus: TMemberInstance['status']
      currStatus: TMemberInstance['status']
    }
  }

  'status-changed': {
    payload: {
      prevStatus: T['status']
      currStatus: T['status']
    }
  }

  'added-member': { payload: { newMember: TMemberInstance } }

  'removed-member': {
    payload: { removedMember: TMemberInstance }
  }

  'changed-owner': {
    payload: { prevOwner?: TMemberInstance }
  }

  'is-empty': {
    payload: boolean
  }
}

interface LobbyInstance<
  T extends LobbyTypes,
  TMemberInstance extends MemberInstance<T['member']>,
> {
  get id(): T['id']
  get owner(): TMemberInstance['user'] | undefined
  get status(): T['status']
  set status(status: T['status'])
  get isEmpty(): boolean
  get isFull(): boolean

  get maxMembers(): number
  get membersSize(): number
  get members(): Readonly<Map<TMemberInstance['id'], TMemberInstance>>
  get users(): readonly TMemberInstance['user'][]

  add(user: TMemberInstance['user']): void
  remove(userId: TMemberInstance['id']): void
  hasUser(userId: TMemberInstance['id']): boolean
  isOwner(userId: TMemberInstance['id']): boolean
  changeUserStatus(
    userId: TMemberInstance['id'],
    status: TMemberInstance['status']
  ): void

  close(): void
}

export type {
  LobbyEvents,
  LobbyID,
  LobbyInstance,
  LobbyState,
  LobbyStatus,
  LobbyTypes,
}
