import { createAsyncThunk, createSlice, createSelector } from '@reduxjs/toolkit'
import {
  createThread as createThreadApi,
  getThreads,
  upVoteThread,
  downVoteThread,
  neutralVoteThread
} from '../../utils/api'

const initialState = {
  items: [],
  status: 'idle',
  error: null,
  filter: 'all'
}

export const fetchThreads = createAsyncThunk(
  'threads/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const threads = await getThreads()
      return threads
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const createThread = createAsyncThunk(
  'threads/create',
  async (payload, { rejectWithValue }) => {
    try {
      const thread = await createThreadApi(payload)
      return thread
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const voteThread = createAsyncThunk(
  'threads/vote',
  async ({ threadId, type }, { rejectWithValue, getState }) => {
    const userId = getState().auth.user?.id
    if (!userId) {
      return rejectWithValue('Silakan login untuk memberikan vote.')
    }

    try {
      if (type === 'up') {
        await upVoteThread(threadId)
        return { threadId, voteType: 1, userId }
      }
      if (type === 'down') {
        await downVoteThread(threadId)
        return { threadId, voteType: -1, userId }
      }
      await neutralVoteThread(threadId)
      return { threadId, voteType: 0, userId }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const threadsSlice = createSlice({
  name: 'threads',
  initialState,
  reducers: {
    setFilter: (state, action) => {
      state.filter = action.payload
    },
    adjustThreadComments: (state, action) => {
      const { threadId, delta } = action.payload
      const thread = state.items.find((item) => item.id === threadId)
      if (thread) {
        thread.totalComments = Math.max(0, (thread.totalComments || 0) + delta)
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchThreads.fulfilled, (state, action) => {
        state.items = action.payload
        state.status = 'succeeded'
        state.error = null
      })
      .addCase(fetchThreads.rejected, (state) => {
        state.status = 'failed'
      })
      .addCase(createThread.fulfilled, (state, action) => {
        state.items.unshift(action.payload)
      })
      .addCase(voteThread.fulfilled, (state, action) => {
        const { threadId, voteType, userId } = action.payload
        const thread = state.items.find((item) => item.id === threadId)
        if (!thread) return

        thread.upVotesBy = thread.upVotesBy.filter((id) => id !== userId)
        thread.downVotesBy = thread.downVotesBy.filter((id) => id !== userId)

        if (voteType === 1) {
          thread.upVotesBy.push(userId)
        } else if (voteType === -1) {
          thread.downVotesBy.push(userId)
        }
      })
      .addMatcher(
        (action) => action.type.startsWith('threads/') && action.type.endsWith('/pending'),
        (state) => {
          state.status = 'loading'
        }
      )
      .addMatcher(
        (action) => action.type.startsWith('threads/') && action.type.endsWith('/rejected'),
        (state, action) => {
          state.status = 'failed'
          state.error = action.payload || action.error.message
        }
      )
  }
})

export const { setFilter, adjustThreadComments } = threadsSlice.actions

export const selectFilteredThreads = createSelector(
  [(state) => state.threads.items, (state) => state.threads.filter],
  (threads, filter) => {
    if (filter === 'all') return threads
    return threads.filter((thread) => thread.category === filter)
  }
)

export const selectCategories = createSelector(
  [(state) => state.threads.items],
  (threads) => {
    const categories = new Set()
    threads.forEach((thread) => {
      if (thread.category) categories.add(thread.category)
    })
    return Array.from(categories)
  }
)

export default threadsSlice.reducer
