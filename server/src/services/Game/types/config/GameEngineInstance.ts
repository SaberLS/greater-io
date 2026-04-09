type PartialScore = unknown
type TotalScore = unknown
type Solution = unknown
type Context = unknown
type Task = unknown
interface Problem {
  readonly task: Task
  readonly solution: Solution
}

interface GameEngineTypes {
  readonly context: Context
  readonly solution: Solution
  readonly problem: Problem
  readonly partial_score: PartialScore
  readonly total_score: TotalScore
}

interface GameEngineInstance<T extends GameEngineTypes> {
  get solutionReviewer(): SolutionReviewerInstance<T>
  get problemGenerator(): ProblemGeneratorInstance<T>
}

interface ProblemGeneratorInstance<T extends GameEngineTypes> {
  generateProblem(amount?: number): Generator<T['problem'], void, unknown>
}

interface SolutionReviewerInstance<T extends GameEngineTypes> {
  rateSolution(
    problem: T['problem'],
    solution: T['solution'],
    context: T['context']
  ): T['partial_score']

  compareScores(l: T['total_score'], r: T['total_score']): number

  reduceScore(
    problem_index: number,
    currentScore: T['total_score'],
    partialScore: T['partial_score']
  ): T['total_score']
}

export type {
  Context,
  GameEngineInstance,
  GameEngineTypes,
  PartialScore,
  Problem,
  ProblemGeneratorInstance,
  Solution,
  SolutionReviewerInstance,
  TotalScore,
}
