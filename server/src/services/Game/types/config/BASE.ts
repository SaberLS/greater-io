type AnswerScore = object
type Answer = unknown
type Context = unknown
type TotalScore = object
type Score = object
type GameID = PropertyKey

interface Question {
  task: unknown
  solution: unknown
}
type GameStatus = string
type PlayerStatus = string

type GameLobbyStatus = string

export type {
  Answer,
  AnswerScore,
  Context,
  GameID,
  GameLobbyStatus,
  GameStatus,
  PlayerStatus,
  Question,
  Score,
  TotalScore,
}
