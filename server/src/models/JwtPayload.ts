interface JwtPayload {
  sub: number // IUser['id']
  tokenVersion: number
  iat?: number
  exp?: number
}

export type { JwtPayload }
