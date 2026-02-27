import * as Lobby from '../../Lobby'
import type { Config } from '../types'
import type { IGameLobby } from './IGameLobby'

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
  createGame: (
    users: readonly T['member']['user'][]
    // rules: T['game']['rules']
  ) => T['game_instance']

  constructor(
    createGame: (
      users: readonly T['member']['user'][]
      // rules: T['game']['rules']
    ) => T['game_instance'],
    ...superArgs: ConstructorParameters<typeof Lobby.Lobby<T, TState>>
  ) {
    super(...superArgs)
    this.createGame = createGame
  }

  start(): void {
    this.gameInstance = this.createGame(this.users)
  }

  get isReady(): boolean {
    for (const member of this.members.values())
      if (!member.isReady) return false

    return true
  }
}

export { GameLobby }
