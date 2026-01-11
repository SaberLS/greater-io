import { log } from '@greater-io/shared'
import bcrypt from 'bcrypt'
import { Strategy as LocalStrategy } from 'passport-local'
import MESSAGES from '../../CONSTS/MESSAGES.json'
import { userRepository } from '../../repositories/UserRepository/userRepository'

const localStrategy = new LocalStrategy(
  {
    usernameField: 'username',
    passwordField: 'password',
  },
  async (username, password, done) => {
    try {
      const user = await userRepository.getUserByUsername(username)
      if (!user) return done(null, false, { message: MESSAGES.auth.login[401] })

      const ok = await bcrypt.compare(password, user.password)
      if (!ok) return done(null, false, { message: MESSAGES.auth.login[401] })

      log('authentication OK', { username })
      return done(null, user, { message: MESSAGES.auth.login[200] })
    } catch (err) {
      done(err)
    }
  }
)

export { localStrategy }
