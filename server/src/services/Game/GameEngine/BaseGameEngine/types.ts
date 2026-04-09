import type { Config } from '../../types'

interface AnswerScore {
  correct: boolean
  time: number
}
type Solution = string
type Task = string

interface Problem extends Config.Problem {
  task: Task
  solution: Solution
}

interface Context {
  questionId: number
  now: number
  startedAt: number
}
type TotalScore = Record<number, AnswerScore>

interface BaseGameEnigneTypes extends Config.GameEngineTypes {
  context: Context
  partial_score: AnswerScore
  problem: Problem
  solution: Solution
  total_score: TotalScore
}

export type { AnswerScore, BaseGameEnigneTypes, Context, Problem, TotalScore }
