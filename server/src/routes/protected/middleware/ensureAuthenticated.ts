import type { RequestHandler } from 'express'
import passport from 'passport'
import MESSAGES from '../../../CONSTS/MESSAGES.json'
import type { IUserDBO } from '../../../models'

const ensureAuthenticated: RequestHandler = (req, res, next) => {
  passport.authenticate(
    'jwt',
    { session: false },
    (error_: any, user: IUserDBO) => {
      if (error_) return next(error_)

      if (!user) {
        return res
          .status(401)
          .json({ success: false, message: MESSAGES.protected.validate[401] })
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
