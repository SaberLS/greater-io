import type { ISocketUser } from '../../../models/User/ISocketUser'

interface IPlayerResult {
  score: number
  time: number
}

interface IPlayer extends ISocketUser {
  result: IPlayerResult
  socketId: string
  status: 'ready' | 'in-game' | 'idle'
}

export type { IPlayer, IPlayerResult }
