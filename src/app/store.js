import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import usersReducer from '../features/users/usersSlice'
import threadsReducer from '../features/threads/threadsSlice'
import threadDetailReducer from '../features/threadDetail/threadDetailSlice'
import leaderboardsReducer from '../features/leaderboards/leaderboardsSlice'
import uiReducer from '../features/ui/uiSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    threads: threadsReducer,
    threadDetail: threadDetailReducer,
    leaderboards: leaderboardsReducer,
    ui: uiReducer
  }
})
