type UserID = PropertyKey
type User = object
type UserState = object

type MemberStatus = string
type MemberState = object

type LobbyID = PropertyKey
type LobbyStatus = string
type LobbyState = object

export type {
  LobbyID,
  LobbyState,
  LobbyStatus,
  MemberState,
  MemberStatus,
  User,
  UserID,
  UserState,
}
