import type { RemoveNever } from '../../utils'

type IApiResponse<TData> = RemoveNever<{
  success: boolean
  message: string
  data: TData
}>

export type { IApiResponse }
