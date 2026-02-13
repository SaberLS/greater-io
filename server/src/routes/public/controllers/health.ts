import { type Request, type Response } from 'express'
import MESSAGES from '../../../CONSTS/MESSAGES.json'
import type { IApiResponse } from '../../../models'

type HealthResponse = IApiResponse<never>
function healthController(req: Request, res: Response) {
  res.json({
    success: true,
    message: MESSAGES.public.health[200],
  } satisfies HealthResponse)
}

export { healthController }
export type { HealthResponse }
