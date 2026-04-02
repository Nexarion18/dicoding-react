import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  loading: 0,
  error: null
}

const isPendingAction = (action) => action.type.endsWith('/pending')
const isRejectedAction = (action) => action.type.endsWith('/rejected')
const isFulfilledAction = (action) => action.type.endsWith('/fulfilled')

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(isPendingAction, (state) => {
        state.loading += 1
      })
      .addMatcher(isFulfilledAction, (state) => {
        state.loading = Math.max(0, state.loading - 1)
        state.error = null
      })
      .addMatcher(isRejectedAction, (state, action) => {
        state.loading = Math.max(0, state.loading - 1)
        state.error = action.payload || action.error?.message || 'Terjadi kesalahan'
      })
  }
})

export const { clearError } = uiSlice.actions

export default uiSlice.reducer
