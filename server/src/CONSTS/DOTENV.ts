import dotenv from 'dotenv'
import DEFAULTS from './DEFAULT_ENV.json'
import { DEFAULT_SECRET } from './DEFAULT_SECRET'

dotenv.config()

const readedPort = Number(process.env.PORT)

const PORT = Number.isNaN(readedPort) ? Number(DEFAULTS.port) : readedPort
const SECRET = process.env.SECRET ?? DEFAULT_SECRET
const CLIENT = process.env.CLIENT ?? DEFAULTS.client
const TOKEN_EXPIRE_TIME =
  process.env.TOKEN_EXPIRE_TIME ?? DEFAULTS['token-expire-time']
const IS_PRODUCTION = process.env.NODE_ENV === 'production'

const JWT_SECRET = process.env.JWT_SECRET!
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is required')
}

export { CLIENT, IS_PRODUCTION, JWT_SECRET, PORT, SECRET, TOKEN_EXPIRE_TIME }
