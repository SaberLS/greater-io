interface IApiResponse<TData> {
  success: boolean
  message: string
  data: TData
}

export type { IApiResponse }
