import type { RequestHandler } from 'express'
import passport from 'passport'
import MESSAGES from '../../../CONSTS/MESSAGES.json'
import type { IUser } from '../../../models/User/User'

const ensureAuthenticated: RequestHandler = (req, res, next) => {
  passport.authenticate(
    'jwt',
    { session: false },
    (error_: any, user: IUser) => {
      if (error_) return next(error_)

      if (!user) {
        return res
          .status(401)
          .json({ message: MESSAGES.protected.validate[401] })
      }

      req.user = user
      next()
    }
  )(req, res, next)
}

export { ensureAuthenticated }
