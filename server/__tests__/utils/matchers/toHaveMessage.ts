import type { MatcherFunction } from 'expect'
import type { IApiResponse } from '../../../src/models'
import { isSupertestResponse } from '../isSupertestResponse'
import type { SuperResponse } from '../types'

const toHaveMessage: MatcherFunction<[message: string]> = function (
  actual: unknown,
  expectedMessage: unknown
) {
  if (!isSupertestResponse(actual)) {
    throw new TypeError('actual needs to be a supertest response')
  }

  if (typeof expectedMessage !== 'string') {
    throw new TypeError('expectedMessage needs to be a string')
  }

  const pass =
    (actual as SuperResponse<IApiResponse<unknown>>).body?.message ===
    expectedMessage

  const printExpected = this.utils.printExpected(expectedMessage)
  const printReceived = this.utils.printReceived(
    (actual as SuperResponse<IApiResponse<unknown>>).body?.message
  )

  const hint =
    pass ?
      this.utils.matcherHint('.not.toHaveMessage')
    : this.utils.matcherHint('.toHaveMessage')

  const message =
    pass ?
      () =>
        `${hint}\n\nExpected response.body.message not to be ${printExpected}, got ${printReceived}`
    : () =>
        `${hint}\n\nExpected response.body.message to be ${printExpected}, got ${printReceived}`

  return {
    pass,
    message,
  }
}

expect.extend({
  toHaveMessage,
})
