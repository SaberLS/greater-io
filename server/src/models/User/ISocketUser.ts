import type { IUser } from './IUser'

interface ISocketUser extends IUser {
  socketId?: string
}

export type { ISocketUser }
