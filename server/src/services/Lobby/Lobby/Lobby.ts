import ms from 'ms'
import {
  AsyncCounter,
  createAbortController,
  type Callbacks,
  type TypedController,
} from '../../../utils'
import { LobbyMember, type ILobbyUser } from '../LobbyMember'
import type {
  LobbyID,
  LobbyMemberState,
  LobbyMemberStatus,
  LobbyMemberT,
  LobbyState,
  LobbyStatus,
  LobbyUserState,
} from '../types'
import type { ILobby } from './ILobby'

class Lobby<
  TUserID extends PropertyKey,
  TUser extends ILobbyUser<TUserID>,
> implements ILobby<
  LobbyID,
  TUserID,
  TUser,
  LobbyUserState<TUserID, TUser>,
  LobbyStatus,
  LobbyState<TUserID, TUser>,
  LobbyMemberStatus,
  LobbyMemberState<TUserID, TUser>
> {
  #id: LobbyID
  #owner?: TUser
  readonly #members = new Map<TUserID, LobbyMemberT<TUserID, TUser>>()
  #status: LobbyStatus
  #maxMembers: number
  #counter = new AsyncCounter<string>(ms('1s'), 10)
  #controller?: TypedController<string>

  private readonly Member: new (user: TUser) => LobbyMemberT<TUserID, TUser> =
    LobbyMember<TUserID, TUser>

  constructor(owner: TUser, maxMembers = 4) {
    this.#members.set(owner.id, new this.Member(owner))

    this.#status = 'open'
    this.#id = crypto.randomUUID()
    this.#owner = owner
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

  private get members() {
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

  get users() {
    return this.members.keys()
  }

  add(user: TUser) {
    this.members.set(user.id, new this.Member(user))
  }

  hasUser(userId: TUserID) {
    return this.members.has(userId)
  }

  get membersState() {
    const result = {} as LobbyState<TUserID, TUser>['members']

    for (const member of this.#members.values())
      result[member.user.id] = member.state

    return result
  }

  get state(): LobbyState<TUserID, TUser> {
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
    for (const member of this.members.values()) member.status = 'in-game'
  }

  changeUserStatus(userId: TUserID, status: LobbyMemberStatus): void {
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

  get id(): LobbyID {
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
