import type { SourceOfCtx, SourceOfEvents } from '../../../utils'
import { Lobby } from '../../Lobby'
import type { Config } from '../types'
import type {
  GameCtx,
  GameLobbyCtx,
  GameMemberCtx,
  PlayerCtx,
} from '../types/config'

class GameLobby<
  TData extends Config.GameLobbyTypes,
  TGameMemberCtx extends GameMemberCtx<TData['game']['player']['member']>,
  TGamePlayerCtx extends PlayerCtx<TData['game']['player'], TGameMemberCtx>,
  TGameCtx extends GameCtx<TData['game'], TGameMemberCtx, TGamePlayerCtx>,
  TGameLobbyCtx extends GameLobbyCtx<TData, TGameMemberCtx>,
>
  extends Lobby<TData, TGameMemberCtx, TGameLobbyCtx>
  implements
    SourceOfEvents<
      Config.GameLobbyInstance<TData, SourceOfCtx<TGameMemberCtx>>,
      Config.GameLobbyEvents<TData, SourceOfCtx<TGameMemberCtx>> &
        TGameLobbyCtx['events']
    >
{
  attemptStart(): void {
    throw new Error('Method not implemented.')
  }
  gameInstance: SourceOfCtx<TGameCtx> | undefined
  protected _createGame: (
    members: SourceOfCtx<TGameMemberCtx>[]
  ) => SourceOfCtx<TGameCtx>

  constructor(
    createGame: (
      members: SourceOfCtx<TGameMemberCtx>[]
    ) => SourceOfCtx<TGameCtx>,
    ...superArgs: ConstructorParameters<
      typeof Lobby<TData, TGameMemberCtx, TGameLobbyCtx>
    >
  ) {
    super(...superArgs)
    this._createGame = createGame
  }

  protected attachGameHandlers(game: SourceOfCtx<TGameCtx>): void {
    game.on('scheduled', (ev): void => {
      this.status = 'game-in-progress'
      for (const member of this._members.values()) member.status = 'in-game'

      this.emit('game:scheduled', { payload: ev.payload })
    })

    game.on('started', (): void => {
      this.emit('game:started', { payload: undefined })
    })

    game.on('ended', (): void => {
      for (const member of this._members.values()) member.status = 'not-ready'
      this.status = 'closed'

      this.emit('game:ended', { payload: undefined })
    })

    game.on('answer', (ev): void => {
      this.emit('game:answer', ev.payload)
    })
  }

  createGame(): void {
    const prevStatus = this.status
    try {
      this.status = 'creating-game'
      if (!this.isReady) throw new Error('Not all lobby members are ready')
      if (this.gameInstance !== undefined && !this.gameInstance.isFinished)
        throw new Error('Game is in progress')

      this.gameInstance = this._createGame([...this.members.values()])
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
