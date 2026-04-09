import type { Config } from '../../types'
import type { BaseGameEnigneTypes } from './types'

class SolutionReviewer<
  T extends BaseGameEnigneTypes,
> implements Config.SolutionReviewerInstance<T> {
  rateSolution(
    question: T['problem'],
    answer: T['solution'],
    context: T['context']
  ): T['partial_score'] {
    return {
      correct: question.solution === answer,
      time: context.now - context.startedAt,
    }
  }

  reduceScore(
    question_index: number,
    currentScore: T['total_score'],
    answerScore: T['partial_score']
  ): T['total_score'] {
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

  compareAnswers(l: T['partial_score'], r: T['partial_score']): number {
    const Correctness = Number(l.correct) - Number(r.correct)
    if (Correctness !== 0) return Correctness

    return l.time - r.time
  }

  sumScore(score: T['total_score']): { correct: number; totalTime: number } {
    const total = { correct: 0, totalTime: 0 }

    for (const current of Object.values(score))
      if (current?.correct) {
        total.correct++
        total.totalTime += current.time
      }

    return total
  }

  compareScores(l: T['total_score'], r: T['total_score']): number {
    const l_total = this.sumScore(l)
    const r_total = this.sumScore(r)

    const Correctness = l_total.correct - r_total.correct
    if (Correctness !== 0) return Correctness

    return l_total.totalTime - r_total.totalTime
  }
}

export { SolutionReviewer }
