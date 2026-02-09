import 'express'
import type { IUser } from '../models'

declare module 'express' {
  interface Request {
    user: IUser
  }
}
