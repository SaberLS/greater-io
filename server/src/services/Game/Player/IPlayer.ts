import * as Lobby from '../../Lobby/types'
import type { Config } from '../types'

interface IPlayer<
  T extends Config.PlayerTypes<Lobby.Config.BASE.User, Config.BASE.Score>,
> {
  user: T['user']
  score: T['score']
}

export type { IPlayer }
