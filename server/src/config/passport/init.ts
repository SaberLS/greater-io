import passport from 'passport'
import { jwtStrategy } from './jwtStrategy'
import { localStrategy } from './localStrategy'

function initPassport(): void {
  passport.use(jwtStrategy)
  passport.use(localStrategy)
}

export { initPassport }
