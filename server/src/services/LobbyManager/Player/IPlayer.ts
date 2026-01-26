import type { ISocketUser } from '../../../models/User/ISocketUser'

interface IPlayerResult {
  score: number
  time: number
}

type PlayerStatus = 'ready' | 'in-game' | 'not-ready'

interface IPlayer extends ISocketUser {
  result: IPlayerResult
  socketId: string
  status: PlayerStatus
}

export type { IPlayer, IPlayerResult }
