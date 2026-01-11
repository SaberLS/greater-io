import type { MatcherFunction } from 'expect'
import { isSupertestResponse } from '../isSupertestResponse'

const toBeOk: MatcherFunction<[]> = function (actual: unknown) {
  if (!isSupertestResponse(actual)) {
    throw new TypeError('actual needs to be a supertest response')
  }

  const pass = actual.ok === true

  const printExpected = this.utils.printExpected(true)
  const printReceived = this.utils.printReceived(actual.ok)

  const hint =
    pass ?
      this.utils.matcherHint('.not.toBeOk')
    : this.utils.matcherHint('.toBeOk')

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
  toBeOk,
})
