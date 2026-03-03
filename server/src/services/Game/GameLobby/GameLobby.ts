import { Emitter } from '../../../utils'
import * as Lobby from '../../Lobby'
import type { Config } from '../types'
import type { GameLobbyEvents, IGameLobby } from './IGameLobby'

class GameLobby<
  T extends Config.GameLobbyTypes<
    Config.GameTypes<Config.PlayerTypes<Lobby.ILobbyUser>>
  >,
  TState,
>
  extends Lobby.Lobby<T, TState>
  implements IGameLobby<T>
{
  gameInstance: T['game_instance'] | undefined
  #createGame: (
    users: readonly T['member']['user'][]
    // rules: T['game']['rules']
  ) => T['game_instance']

  #Emitter = new Emitter<GameLobbyEvents>()

  get event(): Emitter<GameLobbyEvents> {
    return this.#Emitter
  }

  constructor(
    createGame: (
      users: readonly T['member']['user'][]
      // rules: T['game']['rules']
    ) => T['game_instance'],
    ...superArgs: ConstructorParameters<typeof Lobby.Lobby<T, TState>>
  ) {
    super(...superArgs)
    this.#createGame = createGame
  }

  private attachGameHandlers(game: T['game_instance']): void {
    game.event.on('scheduled', (payload): void => {
      this.status = 'game-in-progress'
      for (const member of this._members.values()) member.status = 'in-game'

      this.#Emitter.emit('game:scheduled', payload)
    })

    game.event.on('started', (): void => {
      this.#Emitter.emit('game:started')
    })

    game.event.on('ended', (): void => {
      for (const member of this._members.values()) member.status = 'not-ready'
      this.status = 'closed'

      this.#Emitter.emit('game:ended')
    })

    game.event.on('answer', (payload): void => {
      this.#Emitter.emit('game:answer', payload)
    })
  }

  createGame(): void {
    const prevStatus = this.status
    try {
      this.status = 'creating-game'
      if (!this.isReady) throw new Error('Not all lobby members are ready')
      if (this.gameInstance !== undefined && !this.gameInstance.isFinished)
        throw new Error('Game is in progress')

      this.gameInstance = this.#createGame(this.users)
      this.attachGameHandlers(this.gameInstance)
    } catch (error) {
      this.status = prevStatus
      throw error
    }
  }

  get isReady(): boolean {
    for (const member of this.members.values())
      if (!member.isReady) return false

    return true
  }
}

export { GameLobby }
