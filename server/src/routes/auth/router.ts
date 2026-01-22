import { Router } from 'express'
import { ensureAuthenticated } from '../protected'
import { loginController, logoutController } from './controllers'

const authRouter = Router()

authRouter.post('/login', loginController)
authRouter.post('/logout', ensureAuthenticated, logoutController)

export { authRouter }
