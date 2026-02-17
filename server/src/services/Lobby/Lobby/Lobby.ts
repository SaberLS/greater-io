import ms from 'ms'
import {
  AsyncCounter,
  createAbortController,
  type Callbacks,
  type TypedController,
} from '../../../utils'
import {
  type ILobbyMember,
  type ILobbyMemberState,
  type ILobbyUser,
} from '../LobbyMember'
import type { LobbyStatus } from '../types'
import type { ILobby, ILobbyState, ILobbyUserState } from './ILobby'

class Lobby<
  TLobbyID extends PropertyKey,
  TUserID extends PropertyKey,
  TUser extends ILobbyUser<TUserID>,
  TUserState extends ILobbyUserState<TUserID>,
  TMemberStatus,
  TMemberState extends ILobbyMemberState<TUserID, TUserState, TMemberStatus>,
  TMember extends ILobbyMember<
    TUserID,
    TUser,
    TUserState,
    TMemberStatus,
    TMemberState
  >,
> implements ILobby<
  TLobbyID,
  TUserID,
  TUser,
  TUserState,
  TMemberStatus,
  TMemberState,
  TMember,
  LobbyStatus,
  ILobbyState<
    TLobbyID,
    TUser,
    TUserState,
    TMemberStatus,
    TMemberState,
    LobbyStatus,
    TUserID
  >
> {
  #id: TLobbyID
  #owner?: TUser
  readonly #members = new Map<TUserID, TMember>()
  #status: LobbyStatus
  #maxMembers: number
  #counter = new AsyncCounter<string>(ms('1s'), 10)
  #controller?: TypedController<string>

  private readonly createMember: (user: TUser) => TMember

  constructor(
    id: TLobbyID,
    owner: TUser,
    createMember: (user: TUser) => TMember,
    maxMembers = 4
  ) {
    this.createMember = createMember
    this.#members.set(owner.id, this.createMember(owner))

    this.#owner = owner
    this.#status = 'open'
    this.#id = id
    this.#maxMembers = maxMembers
  }

  close(): void {
    this.#status = 'closed'
  }

  abortStart(reason: string): void {
    this.#controller?.abort(reason)
  }

  get counterState() {
    return this.#counter.state
  }

  async start(callbacks: Partial<Callbacks<string>>) {
    this.#controller = createAbortController<string>()
    this.#status = 'starting'

    try {
      await this.#counter.start(this.#controller.signal, callbacks)
    } finally {
      this.#controller = undefined
    }
  }

  isOwner(user: TUser): boolean {
    return user.id === this.owner?.id
  }

  get members() {
    return this.#members
  }

  get isEmpty() {
    return this.#members.size === 0
  }

  remove(user: TUser): void {
    this.members.delete(user.id)

    if (user.id === this.owner?.id)
      this.owner = this.#members.values().next().value?.user
  }

  add(user: TUser) {
    this.members.set(user.id, this.createMember(user))
  }

  hasUser(userId: TUserID) {
    return this.members.has(userId)
  }

  get membersState(): Record<TUserID, TMemberState> {
    const result = {} as Record<TUserID, TMemberState>

    for (const [id, member] of this.members.entries()) result[id] = member.state

    return result
  }

  get state() {
    return Object.freeze({
      id: this.id,
      ownerId: this.owner?.id,
      status: this.status,
      maxMembers: this.maxMembers,
      currentMemberCount: this.#members.size,
      members: this.membersState,
    })
  }

  startGame() {
    // simulate game in progress
    this.#status = 'game-in-progress'

    // TODO: Ideally members shouldn't have manually set status, it should be recognized by the current Lobby or Game status user participates. this change requiers additional property like ready: boolean, because it can only be set manually by user action.
    // for (const member of this.members.values()) member.status = 'in-game'
  }

  changeUserStatus(userId: TUserID, status: TMemberStatus): void {
    const member = this.members.get(userId)

    if (member) member.status = status
  }

  open() {
    this.#status = 'open'
  }

  // ------- Getters -----------
  get maxMembers() {
    return this.#maxMembers
  }

  get id(): TLobbyID {
    return this.#id
  }

  private set owner(newOwner: TUser | undefined) {
    this.#owner = newOwner
  }

  get owner(): TUser | undefined {
    return this.#owner
  }

  get status() {
    return this.#status
  }

  get isFull() {
    return this.members.size >= this.maxMembers
  }

  get isReady() {
    for (const member of this.members.values())
      if (!member.isReady) return false

    return true
  }
}

export { Lobby }
