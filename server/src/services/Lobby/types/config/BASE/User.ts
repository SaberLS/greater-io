type UserID = PropertyKey
interface UserInstance {
  readonly id: UserID
}
type UserState = object

export type { UserID, UserInstance, UserState }
