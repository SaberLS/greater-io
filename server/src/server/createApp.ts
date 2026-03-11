import cors, { type CorsOptions } from 'cors'
import type { Express } from 'express'
import express from 'express'
import passport from 'passport'
import { authRouter, protectedRouter, publicRouter } from '../routes'

const createApp = (options: CreateAppArgs): Express => {
  const app = express()

  // Middlewares
  app.use(cors(options.cors))
  app.use(passport.initialize())

  app.use(express.json())

  app.use('/auth', authRouter)
  app.use('/public', publicRouter)
  app.use('/protected', protectedRouter)

  // Catch-all for unknown routes
  // @ts-expect-error ignore req is never used
  app.use((req, res): void => {
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
