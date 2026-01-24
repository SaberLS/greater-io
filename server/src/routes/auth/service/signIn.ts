import jwt from 'jsonwebtoken'
import { JWT_SECRET, TOKEN_EXPIRE_TIME } from '../../../CONSTS/DOTENV'
import type { IUser } from '../../../models/User/User'

function signIn(user: IUser) {
  return jwt.sign(
    {
      sub: user.id,
      tokenVersion: user.tokenVersion,
    },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRE_TIME }
}

export { signIn }
