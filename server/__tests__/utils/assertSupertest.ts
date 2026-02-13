import { isSupertestResponse } from './isSupertestResponse'
import type { SuperResponse } from './prepare'

function assertSupertest<TData = unknown>(
  actual: unknown
): SuperResponse<TData> {
  if (!isSupertestResponse(actual)) {
    throw new TypeError('actual needs to be a supertest response')
  }

  return actual as SuperResponse<TData>
}

export { assertSupertest }
