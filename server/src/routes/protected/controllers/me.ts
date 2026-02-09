import { type Request, type Response } from 'express'
import MESSAGES from '../../../CONSTS/MESSAGES.json'
import type { IApiFailure, IApiSuccess, IUser } from '../../../models'

type APIMeSuccess = IApiSuccess<IUser>

function meController(req: Request, res: Response) {
  if (req.user) {
    res.json({
      success: true,
      data: req.user,
      message: MESSAGES.protected.me[200],
    } as IApiSuccess<IUser>)
  } else {
    res.status(404).json({
      success: false,
      message: MESSAGES.protected.me[404],
    } as IApiFailure)
  }
}

export { meController, type APIMeSuccess }
