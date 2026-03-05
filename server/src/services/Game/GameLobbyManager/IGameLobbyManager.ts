import type { Emitts } from '../../../utils'
import type { ILobbyManager, ILobbyUser } from '../../Lobby'
import type { Statefull } from '../../Lobby/types/config'
import type { IGameLobby } from '../GameLobby/IGameLobby'
import type { Config } from '../types'

interface ManagerEvents<
  T extends Config.GameLobbyTypes<
    Config.GameTypes<Config.PlayerTypes<ILobbyUser>>
  >,
  TLobby extends Statefull<IGameLobby<T>, object>,
> {
  'lobby:game:scheduled': {
    lobbyId: T['id']
    startAt: number
    gameState: T['game_instance']['state']
    lobbyState: TLobby['state']
  }
  'lobby:game:started': {
    lobbyId: T['id']
    gameState: T['game_instance']['state']
    lobbyState: TLobby['state']
  }
  'lobby:game:ended': {
    lobbyId: T['id']
    gameState: T['game_instance']['state']
    lobbyState: TLobby['state']
  }
  'lobby:game:answer': {
    lobbyId: T['id']
    score: object // TODO should be T['engine']['answer_score']
    playerId: number
    gameState: T['game_instance']['state']
    lobbyState: TLobby['state']
  }
}

interface IGameLobbyManager<
  T extends Config.GameLobbyTypes<
    Config.GameTypes<Config.PlayerTypes<ILobbyUser>>
  >,
  TLobby extends Statefull<IGameLobby<T>, object>,
>
  extends ILobbyManager<T, TLobby>, Emitts<ManagerEvents<T, TLobby>> {
  createGame(user: T['member']['user']): TLobby['state']

  submitAnswer(
    user: T['member']['user'],
    { index, answer }: { index: number; answer: 'string' }
  ): TLobby

  scheduleGame(user: T['member']['user']): TLobby['state']
}

export type { IGameLobbyManager, ManagerEvents }
