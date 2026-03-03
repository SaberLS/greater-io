import { createSlice } from '@reduxjs/toolkit'
import { RootState } from '../../../pages/root/store/store'

// Define a type for the slice state
export interface CounterState {
  loginVisible: boolean
}

// Define the initial state using that type
const initialState: CounterState = {
  loginVisible: false,
}

export const navSlice = createSlice({
  name: 'nav',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    toggle: state => {
      state.loginVisible = !state.loginVisible
    },
    off: state => {
      state.loginVisible = false
    },
    on: state => {
      state.loginVisible = true
    },
  },
})

export const { on, off, toggle } = navSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectLoginVisible = (state: RootState) => state.nav.loginVisible

export default navSlice.reducer
