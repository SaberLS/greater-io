import 'express'
import type { IUser } from '../models'

declare module 'express' {
  interface User extends IUser {}

  interface Request {
    user: User
  }
}
