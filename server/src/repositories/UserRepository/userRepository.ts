import bcrypt from 'bcrypt'
import type { IUser } from '../../models/User/User'
import { type IUserRepository } from './IUserRepository'

/**
 * @fileoverview
 * users repository placeholder
 *
 * @todo this has to be replaced by real user repository
 */

class UserRepository implements IUserRepository {
  private store = new Map<number, IUser>()

  constructor() {
    this.seed()
  }

  private seed() {
    this.store.set(1, {
      id: 1,
      username: 'patryk',
      password: bcrypt.hashSync('secret', 12),
      tokenVersion: 0,
    })

    this.store.set(2, {
      id: 2,
      username: 'alice',
      password: bcrypt.hashSync('secret', 12),
      tokenVersion: 0,
    })
  }

  async getUserById(id: IUser['id']): Promise<IUser | undefined> {
    return this.store.get(id)
  }

  async getUserByUsername(
    username: IUser['username']
  ): Promise<IUser | undefined> {
    for (const { 1: user } of this.store)
      if (user.username === username) return user

    return undefined
  }

  incrementTokenVersion(id: number) {
    const user = this.store.get(id)
    if (user) return user.tokenVersion++
  }
}

const userRepository = new UserRepository()

export { userRepository }
