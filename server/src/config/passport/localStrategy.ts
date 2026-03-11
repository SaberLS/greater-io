import { log } from '@greater-io/shared'
import bcrypt from 'bcrypt'
import { Strategy as LocalStrategy, type VerifyFunction } from 'passport-local'
import MESSAGES from '../../CONSTS/MESSAGES.json'
import { userRepository } from '../../repositories/UserRepository/userRepository'

const localStrategy = new LocalStrategy(
  {
    usernameField: 'username',
    passwordField: 'password',
  },
  (...args): void => void localVerify(...args)
)

const localVerify = async (
  ...[username, password, done]: Parameters<VerifyFunction>
): Promise<void> => {
  try {
    const user = await userRepository.getUserByUsername(username)
    if (!user)
      return done(undefined, false, { message: MESSAGES.auth.login[401] })

    const ok = await bcrypt.compare(password, user.password)
    if (!ok)
      return done(undefined, false, { message: MESSAGES.auth.login[401] })

    log('authentication OK', { username })
    return done(undefined, user, { message: MESSAGES.auth.login[200] })
  } catch (error) {
    return done(error)
  }
}

export { localStrategy }
