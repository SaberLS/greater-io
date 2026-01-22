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
    // HACK: TOKEN_EXPIRE_TIME is not a number it's StringValue from jsonwebtoken package but type it's not exported and i can't type it correctly
    { expiresIn: TOKEN_EXPIRE_TIME as unknown as number }
  )
}

export { signIn }
