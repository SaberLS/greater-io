import type { IApiResponse } from './IApiResponse'

interface IApiSuccess<TData> extends IApiResponse<TData> {
  success: true
}

export type { IApiSuccess }
