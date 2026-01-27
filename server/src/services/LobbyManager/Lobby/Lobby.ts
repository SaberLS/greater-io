import type { ISocketUser, UserID } from '../../../models'
import type { IPlayer } from '../Player/IPlayer'
import type { ILobby, ILobbyState, LobbyStatus } from './ILobby'

type LobbyID = ReturnType<typeof crypto.randomUUID>
type LobbyPlayer = Omit<IPlayer, 'socketId'>
type LobbyState = ILobbyState<LobbyID, LobbyPlayer>
type PlayerID = UserID

class Lobby implements ILobby<LobbyID, LobbyPlayer> {
  _id: LobbyID
  _ownerId: PlayerID | undefined
  _status: LobbyStatus
  readonly _players: Map<UserID, LobbyPlayer>
  _maxPlayers: number

  constructor(owner: ISocketUser, maxPlayers = 4) {
    this._players = new Map([
      [
        owner.id,
        {
          id: owner.id,
          status: 'not-ready',
          username: owner.username,
          result: { score: 0, time: 0 },
        },
      ],
    ])
    this._status = 'open'
    this._id = crypto.randomUUID()
    this._ownerId = owner.id
    this._maxPlayers = maxPlayers
  }

  get maxPlayers() {
    return this._maxPlayers
  }

  get id() {
    return this._id
  }

  get ownerId() {
    return this._ownerId
  }

  get status() {
    return this._status
  }

  get players() {
    return this._players
  }

  get isFull() {
    return this.players.size >= this.maxPlayers
  }

  leave(user: ISocketUser) {
    if (!this.players.delete(user.id))
      throw new Error(`User ${user.id} is not in this lobby`)

    if (user.id === this.ownerId)
      this._ownerId = this.players.values().next().value?.id
  }

  add(user: ISocketUser) {
    if (this.isFull) throw new Error('Lobby is full')
    if (this.players.has(user.id)) throw new Error('Already in lobby')

    this.players.set(user.id, {
      id: user.id,
      status: 'not-ready',
      username: user.username,
      result: { score: 0, time: 0 },
    })
  }

  get state(): LobbyState {
    return {
      id: this.id,
      ownerId: this.ownerId,
      status: this.status,
      maxPlayers: this.maxPlayers,
      players: [...this.players.values()].reduce(
        (acc, player) => {
          acc[player.id] = {
            id: player.id,
            result: {
              score: 0,
              time: 0,
            },
            status: 'not-ready',
            username: player.username,
          }

          return acc
        },
        {} as LobbyState['players']
      ),
      currentPlayerCount: this.players.size,
    }
  }
}

export { Lobby, type LobbyID, type LobbyPlayer, type LobbyState, type PlayerID }
