import { parseError, success } from '@greater-io/shared'
import {
  type NextFunction,
  type Request,
  type Response,
  type User,
} from 'express'
import passport from 'passport'
import { signIn } from '../service/signIn'

const loginController = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    'local',
    async (
      error_: unknown,
      user: User | undefined,
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

        const token = signIn(user)
        success('logged In', user.username)

        res.json({
          success: true,
          user,
          token,
          message: info?.message,
        })
      } catch (error_: unknown) {
        next(parseError(error_))
      }
    }
  )(req, res, next)
}

export { loginController }
