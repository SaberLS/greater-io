import { Router } from 'express'
import { meController } from './controllers'
import { ensureAuthenticated } from './middleware/ensureAuthenticated'

const protectedRouter = Router()

// Apply middleware to all routes in this router
protectedRouter.use(ensureAuthenticated)

protectedRouter.get('/me', meController)

export { protectedRouter }
