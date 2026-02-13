import type { IApiResponse } from './IApiResponse'

type IApiSuccess<TData> = IApiResponse<TData> & {
  success: true
}

export type { IApiSuccess }
