import bcrypt from 'bcrypt'
import type { IUserDBO } from '../../models/User/IUserDBO'
import { type IUserRepository } from './IUserRepository'

/**
 * @fileoverview
 * users repository placeholder
 *
 * @todo this has to be replaced by real user repository
 */

class UserRepository implements IUserRepository {
  private store = new Map<number, IUserDBO>()

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

  getUserById(id: IUserDBO['id']): Promise<IUserDBO | undefined> {
    return new Promise((resolve): void => resolve(this.store.get(id)))
  }

  getUserByUsername(
    username: IUserDBO['username']
  ): Promise<IUserDBO | undefined> {
    return new Promise((resolve): void => {
      for (const { 1: user } of this.store)
        if (user.username === username) resolve(user)

      // eslint-disable-next-line unicorn/no-useless-undefined
      return resolve(undefined)
    })
  }

  incrementTokenVersion(id: number): number | undefined {
    const user = this.store.get(id)
    if (user) return user.tokenVersion++
  }
}

const userRepository = new UserRepository()

export { userRepository }
