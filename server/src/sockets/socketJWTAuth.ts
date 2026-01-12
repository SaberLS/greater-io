import jwt from 'jsonwebtoken'
import type { Socket } from 'socket.io'
import { JWT_SECRET } from '../CONSTS/DOTENV'
import { userRepository } from '../repositories/UserRepository/userRepository'

interface JwtPayload {
  sub: number
}

async function socketJwtAuth(socket: Socket, next: (err?: Error) => void) {
  const token = socket.handshake.auth?.token
  if (!token) return next(new Error('Unauthorized'))

  try {
    const payload = jwt.verify(token, JWT_SECRET)

    if (typeof payload.sub !== 'number') {
      return next(new Error('Invalid Token'))
    }

    const user = await userRepository.getUserById(payload.sub)
    if (!user) return next(new Error('Unauthorized'))

    socket.data.user = user
    return next()
  } catch {
    return next(new Error('Unauthorized'))
  }
}

export { socketJwtAuth }
