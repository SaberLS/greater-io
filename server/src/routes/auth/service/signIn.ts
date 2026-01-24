import jwt from 'jsonwebtoken'
import { JWT_SECRET, TOKEN_EXPIRE_TIME } from '../../../CONSTS/DOTENV'
import type { IAuthData } from '../../../models/IAuthData'
import type { IUserDBO } from '../../../models/User/IUserDBO'

function signIn(user: IUserDBO): IAuthData {
  const token = jwt.sign(
    {
      sub: user.id,
      tokenVersion: user.tokenVersion,
    },
    JWT_SECRET,
    { expiresIn: TOKEN_EXPIRE_TIME }
  )

  return {
    token,
    expiresAt: Date.now() + TOKEN_EXPIRE_TIME,
    expiresIn: TOKEN_EXPIRE_TIME,
  }
}

export { signIn }
