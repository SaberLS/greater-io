import { type ILobbyUser, LobbyMember } from '../LobbyMember'
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
  #owner: TUser | undefined
  #status: LobbyStatus
  readonly #Members: Map<TUserID, LobbyMemberT<TUserID, TUser>>
  #maxMembers: number

  private readonly Member: new (user: TUser) => LobbyMemberT<TUserID, TUser> =
    LobbyMember<TUserID, TUser>

  constructor(owner: TUser, maxMembers = 4) {
    this.#Members = new Map([[owner.id, new this.Member(owner)]])

    this.#status = 'open'
    this.#id = crypto.randomUUID()
    this.#owner = owner
    this.#maxMembers = maxMembers
  }

  isOwner(user: TUser): boolean {
    return user.id === this.owner?.id
  }

  private get Members() {
    return this.#Members
  }

  get isEmpty() {
    return this.#Members.size === 0
  }

  remove(user: TUser): void {
    this.Members.delete(user.id)

    if (user.id === this.owner?.id)
      this.owner = this.#Members.values().next().value?.user
  }

  get users() {
    return this.Members.keys()
  }

  add(user: TUser) {
    this.Members.set(user.id, new this.Member(user))
  }

  hasUser(userId: TUserID) {
    return this.Members.has(userId)
  }

  get state(): LobbyState<TUserID, TUser> {
    return Object.freeze({
      id: this.id,
      ownerId: this.owner?.id,
      status: this.status,
      maxMembers: this.maxMembers,
      currentMemberCount: this.#Members.size,
      members: Object.freeze(
        [...this.#Members.values()].reduce(
          (acc, Member) => {
            acc[Member.user.id] = Member.state
            return acc
          },
          {} as LobbyState<TUserID, TUser>['members']
        )
      ),
    })
  }

  close(): void {
    this.status = 'closed'
  }

  start(): void {
    // this.Members.forEach(Member => (Member.status = 'in-game'))
    this.status = 'starting'
  }

  beginGame() {
    this.status = 'game-in-progress'

    for (const Member of this.Members.values()) Member.status = 'in-game'
  }

  changeUserStatus(userId: TUserID, status: LobbyMemberStatus): void {
    const Member = this.Members.get(userId)
    if (Member) Member.status = status
  }

  private set status(status: LobbyStatus) {
    this.#status = status
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
    return this.Members.size >= this.maxMembers
  }

  get isReady() {
    for (const Member of this.Members.values())
      if (!Member.isReady) return false

    return true
  }
}

export { Lobby }
