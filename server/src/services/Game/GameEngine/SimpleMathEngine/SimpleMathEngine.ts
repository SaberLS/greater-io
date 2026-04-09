import { BaseGameEnigne } from '../BaseGameEngine/BaseGameEngine'
import { ProblemGenerator } from '../BaseGameEngine/ProblemGenerator'
import { SolutionReviewer } from '../BaseGameEngine/SolutionReviewer'
import type { BaseGameEnigneTypes, Problem } from '../BaseGameEngine/types'

interface MathQuestion extends Problem {
  task: string
  solution: string
}

interface SimpleMathEngineTypes extends BaseGameEnigneTypes {
  problem: MathQuestion
}

const questionGenerator = new ProblemGenerator<SimpleMathEngineTypes>(
  function (): SimpleMathEngineTypes['problem'] {
    const operators = ['+', '-', '*'] as const
    const operator = operators[Math.floor(Math.random() * operators.length)]

    const a = Math.floor(Math.random() * 20) + 1
    const b = Math.floor(Math.random() * 20) + 1

    let result: number

    switch (operator) {
      case '+': {
        result = a + b
        break
      }
      case '-': {
        result = a - b
        break
      }
      case '*': {
        result = a * b
        break
      }
    }

    return {
      task: `${a}${operator}${b}`,
      solution: result.toString(),
    }
  }
)

const questionReviewer = new SolutionReviewer<SimpleMathEngineTypes>()

class SimpleMathEngine extends BaseGameEnigne<SimpleMathEngineTypes> {
  constructor() {
    super(questionGenerator, questionReviewer)
  }
}

export { SimpleMathEngine }
export type { MathQuestion, SimpleMathEngineTypes }
