import type { IUser } from './IUser'

interface IPlayerResult {
  score: number
  time: number
}

interface IPlayer extends IUser {
  result: IPlayerResult
}

export type { IPlayer, IPlayerResult }
