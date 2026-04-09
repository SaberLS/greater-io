import type { Config } from '../../types'
import type { BaseGameEnigneTypes } from './types'

class BaseGameEnigne<
  T extends BaseGameEnigneTypes,
> implements Config.GameEngineInstance<T> {
  protected _problemGenerator: Config.ProblemGeneratorInstance<T>
  protected _solutionReviewer: Config.SolutionReviewerInstance<T>

  constructor(
    problemGenerator: Config.ProblemGeneratorInstance<T>,
    solutionReviewer: Config.SolutionReviewerInstance<T>
  ) {
    this._problemGenerator = problemGenerator
    this._solutionReviewer = solutionReviewer
  }

  get solutionReviewer(): Config.SolutionReviewerInstance<T> {
    return this._solutionReviewer
  }
  get problemGenerator(): Config.ProblemGeneratorInstance<T> {
    return this._problemGenerator
  }
}

export { BaseGameEnigne }
