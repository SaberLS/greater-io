interface IUser {
  id: number
  username: string
  password: string
  tokenVersion: number
  socketId?: string
}

export { type IUser }
