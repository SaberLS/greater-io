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
  (payload: JwtPayload, done: VerifiedCallback) => {
    void verify(payload, done)
  }
)

async function verify(payload: JwtPayload, done: VerifiedCallback) {
  const user = await userRepository.getUserById(payload.sub)

  if (!user) return void done(undefined, false)

  if (
    typeof payload.tokenVersion !== 'number' ||
    payload.tokenVersion !== user.tokenVersion
  ) {
    return void done(undefined, false) // token revoked
  }

  return void done(undefined, user)
}

export { jwtStrategy }
