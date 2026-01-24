import type { IApiResponse } from './IApiResponse'

interface IApiFailure extends IApiResponse<never> {
  success: false
}

export type { IApiFailure }
