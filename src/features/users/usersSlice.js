import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getUsers } from '../../utils/api'

const initialState = {
  items: [],
  entities: {},
  status: 'idle',
  error: null
}

export const fetchUsers = createAsyncThunk(
  'users/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const users = await getUsers()
      return users
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.items = action.payload
        state.entities = action.payload.reduce((acc, user) => {
          acc[user.id] = user
          return acc
        }, {})
        state.status = 'succeeded'
        state.error = null
      })
      .addMatcher(
        (action) => action.type.startsWith('users/') && action.type.endsWith('/pending'),
        (state) => {
          state.status = 'loading'
        }
      )
      .addMatcher(
        (action) => action.type.startsWith('users/') && action.type.endsWith('/rejected'),
        (state, action) => {
          state.status = 'failed'
          state.error = action.payload || action.error.message
        }
      )
  }
})

export const selectUserById = (state, id) => state.users.entities[id]

export default usersSlice.reducer
