import type { IUserDBO } from './IUserDBO'

interface IUser extends Omit<IUserDBO, 'password' | 'tokenVersion'> {}

export { type IUser }
