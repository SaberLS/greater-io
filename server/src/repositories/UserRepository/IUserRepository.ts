import type { IUserDBO } from '../../models'

interface IUserRepository {
  getUserById(id: IUserDBO['id']): Promise<IUserDBO | undefined>
  getUserByUsername(
    username: IUserDBO['username']
  ): Promise<IUserDBO | undefined>
  incrementTokenVersion(id: number): number | undefined
}

export { type IUserRepository }
