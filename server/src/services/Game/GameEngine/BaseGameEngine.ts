import type { Config } from '../types'
import type { IBaseGameEngine } from './IGameEngine'

interface AnswerScore {
  correct: boolean
  time: number
}
interface Question {
  task: string
  solution: string
}
interface Context {
  questionId: number
  now: number
  startedAt: number
}

interface TotalScore {
  correct: number
  time: 0
}

interface BaseGameEnigneTypes extends Config.GameEngineTypes {
  context: Context
  answer_score: AnswerScore
  question: Question
  answer: string
  score: Record<number, AnswerScore>
  total_score: TotalScore
}

class BaseGameEnigne<
  T extends BaseGameEnigneTypes,
> implements IBaseGameEngine<T> {
  reduceScore(
    question_index: number,
    currentScore: T['score'],
    answerScore: T['answer_score']
  ): T['score'] {
    const currentAnswer = currentScore[question_index]

    if (currentAnswer === undefined) {
      currentScore[question_index] = answerScore
      return currentScore
    }

    if (this.compareAnswers(currentAnswer, answerScore) < 0) {
      // new answerScore is equal or better than currentAnswer score
      currentScore[question_index] = answerScore
    }

    return currentScore
  }

  compareAnswers(l: T['answer_score'], r: T['answer_score']): number {
    const Correctness = Number(l.correct) - Number(r.correct)
    if (Correctness !== 0) return Correctness

    return l.time - r.time
  }

  sumScore(score: T['score']): T['total_score'] {
    const total = { correct: 0, time: 0 } satisfies T['total_score']

    for (const current of Object.values(score))
      if (current?.correct) {
        total.correct++
        total.time += current.time
      }

    return total
  }

  compareScores(l: T['score'], r: T['score']): number {
    const l_total = this.sumScore(l)
    const r_total = this.sumScore(r)

    const Correctness = l_total.correct - r_total.correct
    if (Correctness !== 0) return Correctness

    return l_total.time - r_total.time
  }

  rateAnswer(
    question: T['question'],
    answer: T['answer'],
    context: T['context']
  ): T['answer_score'] {
    return {
      correct: question.solution === answer,
      time: context.now - context.startedAt,
    }
  }
}

export { BaseGameEnigne }
export type { AnswerScore, BaseGameEnigneTypes, Context, Question, TotalScore }
