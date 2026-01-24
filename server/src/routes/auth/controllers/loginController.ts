import { parseError, success } from '@greater-io/shared'
import type { NextFunction, Request, Response } from 'express'
import passport from 'passport'
import type { IApiResponse } from '../../../models/ApiResponse/IApiResponse'
import type { IAuthData } from '../../../models/IAuthData'
import type { IUser } from '../../../models/User/IUser'
import type { IUserDBO } from '../../../models/User/IUserDBO'
import { signIn } from '../service/signIn'

interface LoginData {
  user: IUser
  auth: IAuthData
}

type LoginResponse = IApiResponse<LoginData>

const loginController = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    'local',
    async (
      error_: unknown,
      user: IUserDBO | undefined,
      info: { message: string }
    ) => {
      try {
        if (error_) return next(error_)
        if (!user) {
          return res.status(401).json({
            success: false,
            message: info?.message,
          })
        }

        const auth: IAuthData = signIn(user)
        success('logged In', user.username)

        res.json({
          success: true,
          data: {
            user: {
              id: user.id,
              username: user.username,
            },
            auth,
          },
          message: info?.message,
        } as LoginResponse)
      } catch (error_: unknown) {
        next(parseError(error_))
      }
    }
  )(req, res, next)
}

export { loginController }
