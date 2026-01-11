import type { Response } from 'supertest'
import { isSupertestResponse } from './isSupertestResponse'

function assertSupertest(actual: unknown) {
  if (!isSupertestResponse(actual)) {
    throw new TypeError('actual needs to be a supertest response')
  }

  return actual as Response
}

export { assertSupertest }
