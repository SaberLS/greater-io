import type { Response } from 'supertest'
import type {
  IApiFailure,
  IApiResponse,
  IApiSuccess,
} from '../../../src/models'

interface SuperResponse<TBody = object> extends Response {
  body: TBody | IApiFailure
}

type AssertSuperResSuccess<
  T extends (...args: unknown[]) => Promise<SuperResponse<unknown>>,
> =
  Awaited<ReturnType<T>> extends SuperResponse<IApiResponse<infer TData>> ?
    SuperResponse & { body: IApiSuccess<TData> }
  : never

type AssertSuccessInRes<T extends object> = {
  [K in keyof T]: T[K] extends SuperResponse<IApiResponse<infer TData>> ?
    SuperResponse<IApiSuccess<TData>>
  : T[K]
}

type AssertSuperResFailure = SuperResponse<IApiFailure>

export type {
  AssertSuccessInRes,
  AssertSuperResFailure,
  AssertSuperResSuccess,
  SuperResponse,
}
