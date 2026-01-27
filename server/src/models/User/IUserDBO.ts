type UserID = number

interface IUserDBO {
  id: UserID
  username: string
  password: string
  tokenVersion: number
}

export type { IUserDBO, UserID }
