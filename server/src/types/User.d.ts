import 'express'
import type { IUser } from '../models/User/User'

declare module 'express' {
  interface User extends IUser {}

  interface Request {
    user: User
  }
}
