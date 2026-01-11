import type { MatcherFunction } from 'expect'
import { isSupertestResponse } from '../isSupertestResponse'

const toHaveStatus: MatcherFunction<[status: number]> = function (
  actual: unknown,
  expectedStatus: unknown
) {
  if (!isSupertestResponse(actual)) {
    throw new TypeError('actual needs to be a supertest response')
  }
  if (!(typeof expectedStatus === 'number')) {
    throw new TypeError('expectedStatus needs to be a number')
  }

  const pass = actual.status === expectedStatus

  const printExpected = this.utils.printExpected(expectedStatus)
  const printReceived = this.utils.printReceived(actual.status)

  const hint =
    pass ?
      this.utils.matcherHint('.not.toHaveStatus')
    : this.utils.matcherHint('.toHaveStatus')

  const message =
    pass ?
      () =>
        `${hint}\n\nExpected response.ok not to be ${printExpected}, got ${printReceived}`
    : () =>
        `${hint}\n\nExpected message to be ${printExpected}, got ${printReceived}`

  return {
    pass,
    message,
  }
}

expect.extend({
  toHaveStatus,
})
