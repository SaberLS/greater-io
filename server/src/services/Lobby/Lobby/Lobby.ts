// import ms from 'ms'
// import { AsyncCounter, type TypedController } from '../../../utils'
import type { ILobbyUser } from '../LobbyMember'
import type { Config } from '../types'
import type { ILobby, LobbyBaseStatefullTypes } from './ILobby'

class Lobby<
  T extends LobbyBaseStatefullTypes<Config.MemberTypes<ILobbyUser>>,
  TState,
> implements Config.Statefull<ILobby<T>, TState> {
  #id: T['id']
  #owner: T['member']['user'] | undefined
  readonly #members = new Map<T['member']['user']['id'], T['member_instance']>()
  #status: T['status']
  #maxMembers: number
  // #counter = new AsyncCounter<string>(ms('1s'), 10)
  // #controller: TypedController<string> | undefined

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

    this.#members.set(owner.id, this.createMember(owner))

    this.#owner = owner
    this.#status = 'open'
    this.#id = id
    this.#maxMembers = maxMembers
  }

  close(): void {
    this.#status = 'closed'
  }

  // counterState: number
  // get counterState(): number {
  //   return this.#counter.state
  // }
  // abortStart(reason: string): void {
  //   this.#controller?.abort(reason)
  // }

  // async start(callbacks: Partial<Callbacks<string>>): Promise<void> {
  //   this.#controller = createAbortController<string>()
  //   // this.#status = 'starting'

  //   try {
  //     await this.#counter.start(this.#controller.signal, callbacks)
  //   } finally {
  //     this.#controller = undefined
  //   }
  // }

  isOwner(user: T['member']['user']): boolean {
    return user.id === this.owner?.id
  }

  get members(): Readonly<
    Map<T['member']['user']['id'], T['member_instance']>
  > {
    return Object.freeze(new Map(this.#members))
  }

  get isEmpty(): boolean {
    return this.#members.size === 0
  }

  remove(user: T['member']['user']): void {
    this.members.delete(user.id)

    if (user.id === this.owner?.id)
      this.#owner = this.members.values().next().value?.user
  }

  add(user: T['member']['user']): void {
    this.members.set(user.id, this.createMember(user))
  }

  hasUser(userId: T['member']['user']['id']): boolean {
    return this.members.has(userId)
  }

  get membersState(): Readonly<
    Record<T['member']['user']['id'], T['member_instance']['state']>
  > {
    const result = {} as Record<
      T['member']['user']['id'],
      T['member_instance']['state']
    >

    for (const [id, member] of this.members.entries()) result[id] = member.state

    return Object.freeze(result)
  }

  get state(): TState {
    return Object.freeze(this.#createState(this))
  }

  get membersSize(): number {
    return this.#members.size
  }

  changeUserStatus(
    userId: T['member']['user']['id'],
    status: T['member']['status']
  ): void {
    const member = this.members.get(userId)

    if (member) member.status = status
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

  get isFull(): boolean {
    return this.members.size >= this.maxMembers
  }
}

export { Lobby }
