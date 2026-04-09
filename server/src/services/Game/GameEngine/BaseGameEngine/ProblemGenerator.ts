import type { Config } from '../../types'

class ProblemGenerator<
  T extends Config.GameEngineTypes,
> implements Config.ProblemGeneratorInstance<T> {
  createProblem: () => T['problem']

  constructor(createProblem: () => T['problem']) {
    this.createProblem = createProblem
  }

  *generateProblem(amount = 1): Generator<T['problem'], void, unknown> {
    for (let i = 0; i < amount; i++) yield this.createProblem()
  }
}

export { ProblemGenerator }
