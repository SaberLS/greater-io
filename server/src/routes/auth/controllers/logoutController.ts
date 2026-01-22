import { parseError, success } from '@greater-io/shared'
import {
  type NextFunction,
  type Request,
  type RequestHandler,
  type Response,
} from 'express'
import MESSAGES from '../../../CONSTS/MESSAGES.json'
import { Server } from '../../../server'

const logoutController: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.user?.id === undefined) {
      return void res.status(401).json({
        success: false,
        message: MESSAGES.auth.logout[401],
      })
    }

    if (req.user?.socketId) {
      Server.io
        .of('/protected')
        .sockets.get(req.user.socketId)
        ?.disconnect(true)
    }

    success('logout')
    res.json({
      success: true,
      message: MESSAGES.auth.logout[200],
    })
  } catch (error_: unknown) {
    next(parseError(error_))
  }
}

export { logoutController }
