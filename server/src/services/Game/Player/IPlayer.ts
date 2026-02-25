import type { Config } from '../types'

interface IPlayer<
  T extends Config.PlayerTypes,
> extends Config.PlayerInstance<T> {
  leave(): void // temporal disconnect, user still can rejoin
  quit(): void // user left completely can't rejoin
}

export type { IPlayer }
