import type { Config } from '../types'

interface IBaseGameEngine<T extends Config.GameEngineTypes> {
  rateAnswer(
    question: T['question'],
    answer: T['answer'],
    context: T['context']
  ): T['answer_score'] // something like {
  //   correct: boolean
  //   time: number
  // }

  reduceScore(
    question_index: number,
    currentScore: T['score'],
    answerScore: T['answer_score']
  ): T['score']

  // generateQuestion(amount?: number): T['question'][]

  compareScores(l: T['score'], r: T['score']): number
}

interface IGameEngine<
  T extends Config.GameEngineTypes,
> extends IBaseGameEngine<T> {
  generateQuestion(amount?: number): T['question'][]
  isFinished(scores: T['score'][], questions: T['question'][]): boolean
}

export type { IBaseGameEngine, IGameEngine }
