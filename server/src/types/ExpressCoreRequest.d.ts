import 'express-serve-static-core'
import type { IoAuthenticatedUser } from './AuthSocket'

declare module 'express-serve-static-core' {
  interface Request {
    user: IoAuthenticatedUser
  }
}
