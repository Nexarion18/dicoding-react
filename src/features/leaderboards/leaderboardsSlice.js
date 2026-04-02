import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getLeaderboards } from '../../utils/api'

const initialState = {
  items: [],
  status: 'idle',
  error: null
}

export const fetchLeaderboards = createAsyncThunk(
  'leaderboards/fetch',
  async (_, { rejectWithValue }) => {
    try {
      const leaderboards = await getLeaderboards()
      return leaderboards
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const leaderboardsSlice = createSlice({
  name: 'leaderboards',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaderboards.fulfilled, (state, action) => {
        state.items = action.payload
        state.status = 'succeeded'
        state.error = null
      })
      .addMatcher(
        (action) => action.type.startsWith('leaderboards/') && action.type.endsWith('/pending'),
        (state) => {
          state.status = 'loading'
        }
      )
      .addMatcher(
        (action) => action.type.startsWith('leaderboards/') && action.type.endsWith('/rejected'),
        (state, action) => {
          state.status = 'failed'
          state.error = action.payload || action.error.message
        }
      )
  }
})

export default leaderboardsSlice.reducer
