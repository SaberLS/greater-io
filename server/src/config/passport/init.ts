import passport from 'passport'
import { jwtStrategy } from './jwtStrategy'
import { localStrategy } from './localStrategy'

function initPassport() {
  passport.use(jwtStrategy)
  passport.use(localStrategy)
}

export { initPassport }
