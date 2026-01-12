import { Router } from 'express'
import { healthController } from './controllers'

const publicRouter = Router()

// Routes
publicRouter.get('/health', healthController)

export { publicRouter }
