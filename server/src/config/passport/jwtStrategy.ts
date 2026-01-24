import {
  ExtractJwt,
  Strategy as JwtStrategy,
  type VerifiedCallback,
} from 'passport-jwt'
import { JWT_SECRET } from '../../CONSTS/DOTENV'
import type { JwtPayload } from '../../models/JwtPayload'
import { userRepository } from '../../repositories/UserRepository/userRepository'

const jwtStrategy = new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: JWT_SECRET,
  },
  verify
)

async function verify(payload: JwtPayload, done: VerifiedCallback) {
  const user = await userRepository.getUserById(payload.sub)

  if (!user) return done(null, false)

  if (
    typeof payload.tokenVersion !== 'number' ||
    payload.tokenVersion !== user.tokenVersion
  ) {
    return done(null, false) // token revoked
  }

  return done(null, user)
}

export { jwtStrategy }
