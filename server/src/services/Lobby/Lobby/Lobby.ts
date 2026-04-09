import {
  EventSource,
  type AppendTarget,
  type Handler,
  type SourceCtx,
  type SourceOfCtx,
  type SourceOfEvents,
} from '../../../utils'
import type { Config } from '../types'

interface MemberCtx<TData extends Config.BASE.MemberTypes> extends SourceCtx {
  readonly instance: Config.BASE.MemberInstance<TData>
  readonly events: Config.BASE.MemberEvents<TData>
}

interface LobbyCtx<
  TData extends Config.BASE.LobbyTypes,
  TMemberCtx extends MemberCtx<TData['member']>,
> extends SourceCtx {
  readonly instance: Config.BASE.LobbyInstance<TData, SourceOfCtx<TMemberCtx>>
  readonly events: Config.BASE.LobbyEvents<TData, SourceOfCtx<TMemberCtx>>
}

class Lobby<
  TData extends Config.BASE.LobbyTypes,
  TMemberCtx extends MemberCtx<TData['member']>,
  TLobbyCtx extends LobbyCtx<TData, TMemberCtx>,
>
  extends EventSource<
    Config.BASE.LobbyEvents<TData, SourceOfCtx<TMemberCtx>> &
      TLobbyCtx['events'],
    TLobbyCtx['instance']
  >
  implements
    SourceOfEvents<
      Config.BASE.LobbyInstance<TData, SourceOfCtx<TMemberCtx>>,
      Config.BASE.LobbyEvents<TData, SourceOfCtx<TMemberCtx>> &
        TLobbyCtx['events']
    >
{
  protected _id: SourceOfCtx<TLobbyCtx>['id']
  protected _owner: SourceOfCtx<TMemberCtx> | undefined
  protected readonly _members = new Map<
    SourceOfCtx<TMemberCtx>['id'],
    SourceOfCtx<TMemberCtx>
  >()
  protected _status: TData['status']
  protected _maxMembers: number

  private readonly createMember: (
    user: SourceOfCtx<TMemberCtx>['user']
  ) => SourceOfCtx<TMemberCtx>

  protected onMemberStatusChange: Handler<
    AppendTarget<TMemberCtx['events'], SourceOfCtx<TMemberCtx>>,
    'status-changed'
  > = (s): void => {
    this.emit('member:status-changed', {
      payload: {
        ...s.payload,
        member: s.target,
      },
    })
  }

  constructor(
    id: TData['id'],
    owner: TData['member']['user'],
    createMember: (user: TData['member']['user']) => SourceOfCtx<TMemberCtx>,
    maxMembers = 4
  ) {
    super()
    this.createMember = createMember
    const memberOwner = createMember(owner)

    this._owner = memberOwner
    this._status = 'open'
    this._id = id
    this._maxMembers = maxMembers
  }

  changeUserStatus(
    userId: TData['member']['user']['id'],
    status: TData['member']['status']
  ): void {
    const member = this._members.get(userId)

    if (member === undefined) throw new Error(`User is not a lobby member`)
    member.status = status
  }

  close(): void {
    this.status = 'closed'
  }

  isOwner(userId: TData['member']['user']['id']): boolean {
    return userId === this.owner?.id
  }

  get members(): Readonly<
    Map<TData['member']['user']['id'], SourceOfCtx<TMemberCtx>>
  > {
    return this._members
  }

  get users(): readonly TData['member']['user'][] {
    const users: TData['member']['user'][] = []

    for (const member of this._members.values()) users.push(member.user)

    return Object.freeze(users)
  }

  get isEmpty(): boolean {
    return this._members.size === 0
  }

  remove(userId: TData['member']['user']['id']): void {
    const member = this.members.get(userId)
    if (member === undefined) return

    this.members.delete(userId)

    this.emit('removed-member', { payload: { removedMember: member } })
    if (this.isOwner(userId)) this.passOwnership()
  }

  passOwnership(): void {
    const ownerId = this._members.values().next().value?.user.id

    if (ownerId === undefined) {
      this._owner = undefined

      // TODO: Emitter should somehow handle the no arguments events to not require passing arguments
      return this.emit('is-empty', { payload: true })
    }

    this.owner = ownerId
  }

  changeOwner(userId: TData['member']['user']['id']): void {
    this.owner = userId
  }

  add(user: TData['member']['user']): void {
    if (this.hasUser(user.id)) throw new Error('User already in a lobby')
    if (this.isFull) throw new Error('Lobby is full')

    this.members.set(user.id, this.createMember(user))
  }

  hasUser(userId: TData['member']['user']['id']): boolean {
    return this.members.has(userId)
  }

  open(): void {
    this._status = 'open'
  }

  // ------- Getters -----------\
  get membersSize(): number {
    return this._members.size
  }

  get maxMembers(): number {
    return this._maxMembers
  }

  get id(): TData['id'] {
    return this._id
  }

  get ownerId(): TData['member']['user']['id'] | undefined {
    return this._owner?.id
  }

  protected set owner(newOwnerId: TData['member']['user']['id']) {
    if (newOwnerId === this.owner?.id) return

    const newOwner = this._members.get(newOwnerId)
    if (newOwner === undefined) throw new Error('User is not a Lobby Member')

    const prevOwner = this._owner

    this._owner = newOwner
    this.emit('changed-owner', { payload: { prevOwner } })
  }

  get owner(): TData['member']['user'] | undefined {
    return this._owner
  }

  get status(): TData['status'] {
    return this._status
  }

  protected set status(newStatus: TData['status']) {
    if (this.status === newStatus) return

    const prevStatus = this.status
    this._status = newStatus
    this.emit('status-changed', {
      payload: { prevStatus, currStatus: this.status },
    })
  }

  get isFull(): boolean {
    return this._members.size >= this.maxMembers
  }
}

export { Lobby }
export type { LobbyCtx, MemberCtx }
