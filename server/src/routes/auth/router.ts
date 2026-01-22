import { Router } from 'express'
import { loginController } from './controllers'

const authRouter = Router()

authRouter.post('/login', loginController)

export { authRouter }
