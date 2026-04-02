import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  createComment as createCommentApi,
  getThreadDetail,
  upVoteComment,
  downVoteComment,
  neutralVoteComment
} from '../../utils/api'
import { voteThread, adjustThreadComments } from '../threads/threadsSlice'

const initialState = {
  data: null,
  status: 'idle',
  error: null
}

export const fetchThreadDetail = createAsyncThunk(
  'threadDetail/fetch',
  async (threadId, { rejectWithValue }) => {
    try {
      const detail = await getThreadDetail(threadId)
      return detail
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const createComment = createAsyncThunk(
  'threadDetail/createComment',
  async ({ threadId, content }, { rejectWithValue, dispatch }) => {
    try {
      const comment = await createCommentApi({ threadId, content })
      dispatch(adjustThreadComments({ threadId, delta: 1 }))
      return { threadId, comment }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const voteComment = createAsyncThunk(
  'threadDetail/voteComment',
  async ({ threadId, commentId, type }, { rejectWithValue, getState }) => {
    const userId = getState().auth.user?.id
    if (!userId) {
      return rejectWithValue('Silakan login untuk memberikan vote.')
    }

    try {
      if (type === 'up') {
        await upVoteComment({ threadId, commentId })
        return { threadId, commentId, voteType: 1, userId }
      }
      if (type === 'down') {
        await downVoteComment({ threadId, commentId })
        return { threadId, commentId, voteType: -1, userId }
      }
      await neutralVoteComment({ threadId, commentId })
      return { threadId, commentId, voteType: 0, userId }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const threadDetailSlice = createSlice({
  name: 'threadDetail',
  initialState,
  reducers: {
    clearThreadDetail: (state) => {
      state.data = null
      state.status = 'idle'
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchThreadDetail.fulfilled, (state, action) => {
        state.data = action.payload
        state.status = 'succeeded'
        state.error = null
      })
      .addCase(createComment.fulfilled, (state, action) => {
        if (!state.data || state.data.id !== action.payload.threadId) return
        state.data.comments.unshift(action.payload.comment)
        state.data.totalComments = state.data.comments.length
      })
      .addCase(voteComment.fulfilled, (state, action) => {
        if (!state.data || state.data.id !== action.payload.threadId) return
        const comment = state.data.comments.find((item) => item.id === action.payload.commentId)
        if (!comment) return

        comment.upVotesBy = comment.upVotesBy.filter((id) => id !== action.payload.userId)
        comment.downVotesBy = comment.downVotesBy.filter((id) => id !== action.payload.userId)

        if (action.payload.voteType === 1) {
          comment.upVotesBy.push(action.payload.userId)
        } else if (action.payload.voteType === -1) {
          comment.downVotesBy.push(action.payload.userId)
        }
      })
      .addCase(voteThread.fulfilled, (state, action) => {
        if (!state.data || state.data.id !== action.payload.threadId) return
        state.data.upVotesBy = state.data.upVotesBy.filter((id) => id !== action.payload.userId)
        state.data.downVotesBy = state.data.downVotesBy.filter((id) => id !== action.payload.userId)

        if (action.payload.voteType === 1) {
          state.data.upVotesBy.push(action.payload.userId)
        } else if (action.payload.voteType === -1) {
          state.data.downVotesBy.push(action.payload.userId)
        }
      })
      .addMatcher(
        (action) => action.type.startsWith('threadDetail/') && action.type.endsWith('/pending'),
        (state) => {
          state.status = 'loading'
        }
      )
      .addMatcher(
        (action) => action.type.startsWith('threadDetail/') && action.type.endsWith('/rejected'),
        (state, action) => {
          state.status = 'failed'
          state.error = action.payload || action.error.message
        }
      )
  }
})

export const { clearThreadDetail } = threadDetailSlice.actions

export default threadDetailSlice.reducer
