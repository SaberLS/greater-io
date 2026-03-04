import { io } from 'socket.io-client'
import { UserSocket } from './UserSocket/UserSocket'

const url = (import.meta as unknown as NodeJS.Process).env.VITE_SERVER_URL

if (url === undefined) throw new Error('SERVER_URL is undefined')

const protectedSocket = new UserSocket((token: string) =>
  io(`${url}/protected`, {
    transports: ['websocket'],
    auth: { token },
  })
)

export { protectedSocket }
