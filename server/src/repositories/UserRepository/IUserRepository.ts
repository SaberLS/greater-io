import type { IUser } from '../../models/User/User'

interface IUserRepository {
  getUserById(id: IUser['id']): Promise<IUser | undefined>
  getUserByUsername(username: IUser['username']): Promise<IUser | undefined>
  incrementTokenVersion(id: number): number | undefined
}

export { type IUserRepository }
