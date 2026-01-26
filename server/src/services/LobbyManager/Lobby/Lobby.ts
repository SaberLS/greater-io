import type { ISocketUser } from '../../../models'
import type { IPlayer } from '../Player/IPlayer'
import type { ILobby, LobbyStatus } from './ILobby'

type LobbyID = ReturnType<typeof crypto.randomUUID>

class Lobby implements ILobby<LobbyID, number, IPlayer> {
  _id: LobbyID
  _ownerId: number
  _status: LobbyStatus
  readonly _players: Map<number, IPlayer>
  _maxPlayers: number

  constructor(owner: ISocketUser, maxPlayers = 4) {
    this._players = new Map([
      [
        owner.id,
        {
          id: owner.id,
          status: 'not-ready',
          socketId: owner.socketId,
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

  add(user: ISocketUser) {
    if (this.isFull) throw new Error('Lobby is full')
    if (this.players.has(user.id)) throw new Error('Already in lobby')

    this.players.set(user.id, {
      id: user.id,
      status: 'not-ready',
      socketId: user.socketId,
      username: user.username,
      result: { score: 0, time: 0 },
    })
  }

  get state() {
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
        {} as Record<number, Omit<IPlayer, 'socketId'>>
      ),
      currentPlayerCount: this.players.size, // optional convenience
    }
  }
}

export { Lobby, type LobbyID }
