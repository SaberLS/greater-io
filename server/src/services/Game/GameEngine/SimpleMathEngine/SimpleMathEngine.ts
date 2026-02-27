import { BaseGameEnigne, type BaseGameEnigneTypes } from '../BaseGameEngine'
import type { IGameEngine } from '../IGameEngine'

interface MathQuestion {
  task: string
  solution: string
}

interface SimpleMathEngineTypes extends BaseGameEnigneTypes {
  question: MathQuestion
}

class SimpleMathEngine
  extends BaseGameEnigne<SimpleMathEngineTypes>
  implements IGameEngine<SimpleMathEngineTypes>
{
  // ?TODO: This propably may be converted into generator function
  private singleQuestion(): SimpleMathEngineTypes['question'] {
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

  generateQuestion(amount = 1): SimpleMathEngineTypes['question'][] {
    const questions = [] as SimpleMathEngineTypes['question'][]

    while (questions.length < amount) questions.push(this.singleQuestion())

    return questions
  }
}

export { SimpleMathEngine }
export type { MathQuestion, SimpleMathEngineTypes }
