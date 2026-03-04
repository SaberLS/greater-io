import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { LoginResponse } from './slices'
import { RootState } from './store'

const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: `${(import.meta as unknown as NodeJS.Process).env.VITE_SERVER_URL}`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token
      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }

      return headers
    },
  }),
  endpoints: () => ({}),
})

const extendedApi = api.injectEndpoints({
  endpoints: builder => ({
    login: builder.mutation<
      LoginResponse,
      { username: string; password: string }
    >({
      query: body => ({
        url: 'auth/login',
        method: 'POST',
        body,
      }),
    }),
  }),
})

const { useLoginMutation } = extendedApi

export { api, useLoginMutation }
