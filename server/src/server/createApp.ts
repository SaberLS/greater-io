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
  app.use('/public', publicRouter)
  app.use('/protected', protectedRouter)

  // Catch-all for unknown routes
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: 'Route not found',
    })
  })

  return app
}

interface CreateAppArgs {
  cors: CorsOptions
}

export { createApp, type CreateAppArgs }
export default createApp
