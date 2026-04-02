import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  getOwnProfile,
  loginUser as loginApi,
  registerUser as registerApi,
  tokenStorage
} from '../../utils/api'

const initialState = {
  user: null,
  status: 'idle',
  error: null,
  registrationResult: null
}

export const registerAccount = createAsyncThunk(
  'auth/register',
  async (payload, { rejectWithValue }) => {
    try {
      const user = await registerApi(payload)
      return user
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const loginAccount = createAsyncThunk(
  'auth/login',
  async (payload, { rejectWithValue }) => {
    try {
      await loginApi(payload)
      const user = await getOwnProfile()
      return user
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchOwnProfile = createAsyncThunk(
  'auth/profile',
  async (_, { rejectWithValue }) => {
    try {
      const user = await getOwnProfile()
      return user
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  tokenStorage.clearAccessToken()
  return null
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerAccount.fulfilled, (state, action) => {
        state.registrationResult = action.payload
        state.error = null
      })
      .addCase(loginAccount.fulfilled, (state, action) => {
        state.user = action.payload
        state.error = null
      })
      .addCase(fetchOwnProfile.fulfilled, (state, action) => {
        state.user = action.payload
        state.error = null
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
      })
      .addMatcher(
        (action) => action.type.startsWith('auth/') && action.type.endsWith('/pending'),
        (state) => {
          state.status = 'loading'
          state.error = null
        }
      )
      .addMatcher(
        (action) => action.type.startsWith('auth/') && action.type.endsWith('/fulfilled'),
        (state) => {
          state.status = 'succeeded'
        }
      )
      .addMatcher(
        (action) => action.type.startsWith('auth/') && action.type.endsWith('/rejected'),
        (state, action) => {
          state.status = 'failed'
          state.error = action.payload || action.error.message
        }
      )
  }
})

export default authSlice.reducer
