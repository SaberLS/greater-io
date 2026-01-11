import cors, { type CorsOptions } from 'cors'
import express from 'express'
import passport from 'passport'
import { authRouter, protectedRouter, publicRouter } from '../routes'

const createApp = (options: CreateAppArgs) => {
  const app = express()

  // Middlewares
  app.use(cors(options.cors))
  app.use(passport.initialize())

  app.use(express.json())

  app.use('/auth', authRouter)
  app.use('/api/public', publicRouter)
  app.use('/api/protected', protectedRouter)

  return app
}

interface CreateAppArgs {
  cors: CorsOptions
}

export { createApp, type CreateAppArgs }
export default createApp
