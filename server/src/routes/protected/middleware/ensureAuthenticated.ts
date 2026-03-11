import type { RequestHandler, Response } from 'express'
import passport from 'passport'
import MESSAGES from '../../../CONSTS/MESSAGES.json'
import type { IApiFailure, IUserDBO } from '../../../models'

const ensureAuthenticated: RequestHandler = (req, res, next): void => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  passport.authenticate(
    'jwt',
    { session: false },
    (error_: unknown, user: IUserDBO): void | Response<IApiFailure> => {
      if (error_) return next(error_)

      if (!user) {
        return res.status(401).json({
          success: false,
          message: MESSAGES.protected.validate[401],
        } satisfies IApiFailure)
      }

      req.user = {
        username: user.username,
        id: user.id,
      }
      next()
    }
  )(req, res, next)
}

export { ensureAuthenticated }
