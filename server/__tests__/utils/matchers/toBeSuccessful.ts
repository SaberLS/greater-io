import type { MatcherFunction } from 'expect'
import type { IApiResponse } from '../../../src/models'
import { isSupertestResponse } from '../isSupertestResponse'
import type { SuperResponse } from '../types'

const toBeSuccessful: MatcherFunction<[]> = function (actual: unknown) {
  if (!isSupertestResponse(actual)) {
    throw new TypeError('actual needs to be a supertest response')
  }

  const pass =
    (actual as SuperResponse<IApiResponse<unknown>>).body?.success === true

  const message =
    pass ?
      () =>
        `${this.utils.matcherHint('.not.toBeSuccessful')} Expected response.body.success not to be true, received ${this.utils.printReceived(actual.body)} `
    : () =>
        `${this.utils.matcherHint('.toBeSuccessful')} Expected response.body.success to be true, received ${this.utils.printReceived(actual.body)}`

  return {
    pass,
    message,
  }
}

expect.extend({
  toBeSuccessful,
})
