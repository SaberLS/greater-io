import ms from 'ms'
import { Emitter } from '../../../utils'
import { type ILobbyStore, type ILobbyUser } from '../../Lobby'
import { LobbyManager } from '../../Lobby/LobbyManager'
import type { Statefull } from '../../Lobby/types/config'
import type { IGameLobby } from '../GameLobby/IGameLobby'
import type { Config } from '../types'
import type { IGameLobbyManager, ManagerEvents } from './IGameLobbyManager'

class GameLobbyManager<
  T extends Config.GameLobbyTypes<
    Config.GameTypes<Config.PlayerTypes<ILobbyUser>>
  >,
  TLobby extends Statefull<IGameLobby<T>, object>,
  TLobbyStore extends ILobbyStore<T, TLobby>,
>
  extends LobbyManager<T, TLobby, TLobbyStore>
  implements IGameLobbyManager<T, TLobby>
{
  #Emitter = new Emitter<ManagerEvents<T, TLobby>>()

  get event(): Emitter<ManagerEvents<T, TLobby>> {
    return this.#Emitter
  }

  private wireGame(lobby: TLobby): void {
    lobby.event.on('game:scheduled', ({ startAt }): void => {
      if (!lobby.gameInstance)
        throw new Error(`Game doesn't exist in this lobby`)

      this.#Emitter.emit('lobby:game:scheduled', {
        lobbyId: lobby.id,
        startAt,
        gameState: lobby.gameInstance.state,
        lobbyState: lobby.state,
      })
    })

    lobby.event.on('game:started', (): void => {
      if (!lobby.gameInstance)
        throw new Error(`Game doesn't exist in this lobby`)
      this.#Emitter.emit('lobby:game:started', {
        lobbyId: lobby.id,
        gameState: lobby.gameInstance.state,
        lobbyState: lobby.state,
      })
    })

    lobby.event.on('game:ended', (): void => {
      if (!lobby.gameInstance)
        throw new Error(`Game doesn't exist in this lobby`)
      this.#Emitter.emit('lobby:game:ended', {
        lobbyId: lobby.id,
        gameState: lobby.gameInstance.state,
        lobbyState: lobby.state,
      })
    })
  }

  createGame(user: T['member']['user']): TLobby['state'] {
    const lobby = this.store.getLobbyByUserId(user.id)

    if (lobby === undefined)
      throw new Error(`User with id: ${String(user.id)}, is not a lobby member`)
    if (!lobby.isOwner(user)) throw new Error(`User is not a lobby owner`)

    lobby.createGame()

    return lobby.state
  }

  scheduleGame(user: T['member']['user']): TLobby['state'] {
    const lobby = this.store.getLobbyByUserId(user.id)

    if (lobby === undefined)
      throw new Error(`User with id: ${String(user.id)}, is not a lobby member`)
    if (!lobby.isOwner(user)) throw new Error(`User is not a lobby owner`)
    if (lobby.gameInstance === undefined)
      throw new Error(`Game is not available`)

    this.wireGame(lobby)
    lobby.gameInstance.scheduleStart(ms('5s'))

    return lobby.state
  }

  submitAnswer(
    user: T['member']['user'],
    { index, answer }: { index: number; answer: 'string' }
  ): TLobby {
    const lobby = this.store.getLobbyByUserId(user.id)
    if (lobby === undefined)
      throw new Error(`User with id: ${String(user.id)}, is not a lobby member`)

    if (!lobby.gameInstance) throw new Error(`Game doesn't exist in this lobby`)

    const score = lobby.gameInstance.submitAnswer(user.id, index, answer, {
      questionId: index,
      now: Date.now(),
      startedAt: lobby.gameInstance.startAt,
    })

    this.event.emit('lobby:game:answer', {
      playerId: user.id,
      lobbyId: lobby.id,
      score,
      state: lobby.gameInstance.state,
    })

    return lobby
  }
}

export { GameLobbyManager }
