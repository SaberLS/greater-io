import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../../CONSTS/DOTENV'
import { userRepository } from '../../repositories/UserRepository/userRepository'
import type { IoSocketBeforeAuth } from '../../types/AuthSocket'

async function socketJwtAuth(
  socket: IoSocketBeforeAuth,
  next: (err?: Error) => void
) {
  const token = socket.handshake.auth?.token
  if (!token) return next(new Error('Unauthorized'))

  try {
    const payload = jwt.verify(token, JWT_SECRET)

    if (typeof payload.sub !== 'number') {
      return next(new Error('Invalid Token'))
    }

    const user = await userRepository.getUserById(payload.sub)
    if (!user) return next(new Error('Unauthorized'))

    socket.data.user = { id: user.id, username: user.username }

    return next()
  } catch {
    return next(new Error('Unauthorized'))
  }
}

export { socketJwtAuth }
