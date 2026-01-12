import { type Request, type Response } from 'express'
import MESSAGES from '../../../CONSTS/MESSAGES.json'

async function healthController(req: Request, res: Response) {
  res.json({
    success: true,
    message: MESSAGES.public.health[200],
  })
}

export { healthController }
