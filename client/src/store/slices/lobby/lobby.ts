// store/slices/lobbySlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { LobbyState } from '../../../services/sockets'
import { RootState } from '../../store'
import { selectUserId } from '../auth/authSlice'

interface LobbySliceState {
  current?: LobbyState
}

const initialState: LobbySliceState = {}

const lobbySlice = createSlice({
  name: 'lobby',
  initialState,
  reducers: {
    lobbyUpdated(state, action: PayloadAction<LobbyState>) {
      state.current = action.payload
    },
    lobbyCleared(state) {
      state.current = undefined
    },
  },
})

const selectCurrentLobby = (state: RootState) => state.lobby.current
const selectLobbyMembers = (state: RootState) =>
  selectCurrentLobby(state)?.members

const selectCurrentUser = (state: RootState) => {
  const id = selectUserId(state)
  if (id === undefined) return undefined

  return selectLobbyMembers(state)?.[id]
}

const { lobbyUpdated, lobbyCleared } = lobbySlice.actions

export {
  lobbyCleared,
  lobbyUpdated,
  selectCurrentLobby,
  selectCurrentUser,
  selectLobbyMembers,
}
export default lobbySlice.reducer
export type { LobbySliceState }
