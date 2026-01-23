import { type Request, type Response } from 'express'
import MESSAGES from '../../../CONSTS/MESSAGES.json'

async function meController(req: Request, res: Response) {
  if (Boolean(req.user)) {
    res.json({
      success: true,
      user: req.user,
      message: MESSAGES.protected.me[200],
    })
  } else {
    res.status(401).json({
      success: false,
    })
  }
}

export { meController }
