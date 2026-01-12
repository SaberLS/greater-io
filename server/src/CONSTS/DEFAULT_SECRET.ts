import crypto from 'node:crypto'

const DEFAULT_SECRET = crypto.randomBytes(32).toString('hex')

export { DEFAULT_SECRET }
