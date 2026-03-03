import type { Emitts } from '../../../utils'
import type { ILobbyManager, ILobbyUser } from '../../Lobby'
import type { Statefull } from '../../Lobby/types/config'
import type { IGameLobby } from '../GameLobby/IGameLobby'
import type { Config } from '../types'

interface ManagerEvents<
  T extends Config.GameLobbyTypes<
    Config.GameTypes<Config.PlayerTypes<ILobbyUser>>
  >,
> {
  'lobby:game:scheduled': {
    lobbyId: T['id']
    startAt: number
    state: T['game_instance']['state']
  }
  'lobby:game:started': {
    lobbyId: T['id']
    state: T['game_instance']['state']
  }
  'lobby:game:ended': {
    lobbyId: T['id']
    state: T['game_instance']['state']
  }
  'lobby:game:answer': {
    lobbyId: T['id']
    score: object // TODO should be T['engine']['answer_score']
    playerId: number
    state: T['game_instance']['state']
  }
}

interface IGameLobbyManager<
  T extends Config.GameLobbyTypes<
    Config.GameTypes<Config.PlayerTypes<ILobbyUser>>
  >,
  TLobby extends Statefull<IGameLobby<T>, object>,
>
  extends ILobbyManager<T, TLobby>, Emitts<ManagerEvents<T>> {
  createGame(user: T['member']['user']): TLobby['state']

  submitAnswer(
    user: T['member']['user'],
    { index, answer }: { index: number; answer: 'string' }
  ): TLobby

  scheduleGame(user: T['member']['user']): TLobby['state']
}

export type { IGameLobbyManager, ManagerEvents }
