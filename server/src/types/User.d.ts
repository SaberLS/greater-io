import 'express'
import type { IoAuthenticatedUser } from './AuthSocket'

declare module 'express' {
  interface Request {
    user: IoAuthenticatedUser
  }
}
