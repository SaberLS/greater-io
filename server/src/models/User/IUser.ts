import type { IUserDBO } from './IUserDBO'

type IUser = Omit<IUserDBO, 'password' | 'tokenVersion'>

export { type IUser }
