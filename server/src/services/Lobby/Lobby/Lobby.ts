import { type ILobbyUser, LobbyPlayer } from '../LobbyPlayer'
import type {
  LobbyID,
  LobbyPlayerResult,
  LobbyPlayerState,
  LobbyPlayerStatus,
  LobbyPlayerT,
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
  LobbyPlayerStatus,
  LobbyPlayerState<TUserID, TUser>,
  LobbyPlayerResult
> {
  #id: LobbyID
  #owner: TUser | undefined
  #status: LobbyStatus
  readonly #players: Map<TUserID, LobbyPlayerT<TUserID, TUser>>
  #maxPlayers: number

  private readonly Player: new (user: TUser) => LobbyPlayerT<TUserID, TUser> =
    LobbyPlayer<TUserID, TUser>

  constructor(owner: TUser, maxPlayers = 4) {
    this.#players = new Map([[owner.id, new this.Player(owner)]])

    this.#status = 'open'
    this.#id = crypto.randomUUID()
    this.#owner = owner
    this.#maxPlayers = maxPlayers
  }

  private get players() {
    return this.#players
  }

  get isEmpty() {
    return this.#players.size === 0
  }

  remove(user: TUser): void {
    this.players.delete(user.id)

    if (user.id === this.owner?.id)
      this.owner = this.#players.values().next().value?.user
  }

  get users() {
    return this.players.keys()
  }

  add(user: TUser) {
    this.players.set(user.id, new this.Player(user))
  }

  hasUser(userId: TUserID) {
    return this.players.has(userId)
  }

  get state(): LobbyState<TUserID, TUser> {
    return Object.freeze({
      id: this.id,
      ownerId: this.owner?.id,
      status: this.status,
      maxPlayers: this.maxPlayers,
      currentPlayerCount: this.#players.size,
      players: Object.freeze(
        [...this.#players.values()].reduce(
          (acc, player) => {
            acc[player.user.id] = player.state
            return acc
          },
          {} as LobbyState<TUserID, TUser>['players']
        )
      ),
    })
  }

  close(): void {
    this.status = 'closed'
  }

  set status(state: LobbyStatus) {
    this.#status = state
  }

  // ------- Getters -----------
  get maxPlayers() {
    return this.#maxPlayers
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
    return this.players.size >= this.maxPlayers
  }

  get isReady() {
    for (const player of this.players.values())
      if (!player.isReady) return false

    return true
  }
}

export { Lobby }
