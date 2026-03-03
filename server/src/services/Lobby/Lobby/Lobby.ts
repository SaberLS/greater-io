import type { Config } from '../types'
import type { ILobby, LobbyBaseTypes } from './ILobby'

class Lobby<T extends LobbyBaseTypes, TState> implements Config.Statefull<
  ILobby<T>,
  TState
> {
  #id: T['id']
  #owner: T['member']['user'] | undefined
  protected readonly _members = new Map<
    T['member']['user']['id'],
    T['member_instance']
  >()
  #status: T['status']
  #maxMembers: number

  #createState: (t: Lobby<T, TState>) => TState
  private readonly createMember: (
    user: T['member']['user']
  ) => T['member_instance']

  constructor(
    id: T['id'],
    owner: T['member']['user'],
    createMember: (user: T['member']['user']) => T['member_instance'],
    createState: (t: Lobby<T, TState>) => TState,
    maxMembers = 4
  ) {
    this.createMember = createMember
    this.#createState = createState

    this._members.set(owner.id, this.createMember(owner))

    this.#owner = owner
    this.#status = 'open'
    this.#id = id
    this.#maxMembers = maxMembers
  }

  close(): void {
    this.#status = 'closed'
  }

  isOwner(user: T['member']['user']): boolean {
    return user.id === this.owner?.id
  }

  get members(): Readonly<
    Map<T['member']['user']['id'], T['member_instance']>
  > {
    return Object.freeze(new Map(this._members))
  }

  get users(): readonly T['member']['user'][] {
    const users: T['member']['user'][] = []

    for (const member of this._members.values()) users.push(member.user)

    return Object.freeze(users)
  }

  get isEmpty(): boolean {
    return this._members.size === 0
  }

  remove(user: T['member']['user']): void {
    this._members.delete(user.id)

    if (this.isOwner(user)) this.passOwnership()
  }

  passOwnership(): void {
    this.owner = this._members.values().next().value?.user
  }

  changeOwner(user: T['member']['user']): void {
    if (!this.hasUser(user.id)) throw new Error('User is not a Lobby Member')

    this.#owner = user
  }

  add(user: T['member']['user']): void {
    if (this.hasUser(user.id)) throw new Error('User already in a lobby')
    if (this.isFull) throw new Error('Lobby is full')

    this._members.set(user.id, this.createMember(user))
  }

  hasUser(userId: T['member']['user']['id']): boolean {
    return this._members.has(userId)
  }
  get state(): TState {
    return Object.freeze(this.#createState(this))
  }

  get membersSize(): number {
    return this._members.size
  }

  changeUserStatus(
    userId: T['member']['user']['id'],
    status: T['member']['status']
  ): void {
    const member = this._members.get(userId)

    if (member === undefined) throw new Error(`User is not a lobby member`)
    member.status = status
  }

  open(): void {
    this.#status = 'open'
  }

  // ------- Getters -----------
  get maxMembers(): number {
    return this.#maxMembers
  }

  get id(): T['id'] {
    return this.#id
  }

  get ownerId(): T['member']['user']['id'] | undefined {
    return this.#owner?.id
  }

  private set owner(newOwner: T['member']['user'] | undefined) {
    this.#owner = newOwner
  }

  get owner(): T['member']['user'] | undefined {
    return this.#owner
  }

  get status(): T['status'] {
    return this.#status
  }

  set status(newStatus: T['status']) {
    this.#status = newStatus
  }

  get isFull(): boolean {
    return this._members.size >= this.maxMembers
  }
}

export { Lobby }
