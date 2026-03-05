// authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../store'

interface AuthState {
  token: string | undefined
  user:
    | {
        id: number
        username: string
      }
    | undefined
  expiresAt: number | undefined
}
interface LoginResponse {
  success: boolean
  message: string
  data: {
    user: {
      id: number
      username: string
    }
    auth: {
      token: string
      expiresAt: number
      expiresIn: number
    }
  }
}

const initialState: AuthState = {
  token: undefined,
  user: undefined,
  expiresAt: undefined,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<AuthState>) => {
      state.token = action.payload.token
      state.expiresAt = action.payload.expiresAt
      state.user = action.payload.user
    },
    logout: state => {
      state.token = undefined
      state.expiresAt = undefined
      state.user = undefined
    },
  },
})

export const { setCredentials, logout } = authSlice.actions

export const selectAuth = (state: RootState) => state.auth
export const selectUser = (state: RootState) => selectAuth(state).user
export const selectUserId = (state: RootState) => selectUser(state)?.id
export const isLoggedIn = (state: RootState) =>
  state.auth.token !== undefined &&
  state.auth.expiresAt !== undefined &&
  state.auth.user !== undefined &&
  Date.now() < state.auth.expiresAt

export default authSlice.reducer
export type { AuthState, LoginResponse }
