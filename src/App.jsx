import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from './app/hooks'
import Header from './components/Header'
import LoadingOverlay from './components/LoadingOverlay'
import ProtectedRoute from './routes/ProtectedRoute'
import ThreadsPage from './pages/ThreadsPage'
import ThreadDetailPage from './pages/ThreadDetailPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import CreateThreadPage from './pages/CreateThreadPage'
import LeaderboardPage from './pages/LeaderboardPage'
import { fetchThreads } from './features/threads/threadsSlice'
import { fetchUsers } from './features/users/usersSlice'
import { fetchLeaderboards } from './features/leaderboards/leaderboardsSlice'
import { fetchOwnProfile } from './features/auth/authSlice'
import { tokenStorage } from './utils/api'

function App () {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)

  useEffect(() => {
    dispatch(fetchThreads())
    dispatch(fetchUsers())
    dispatch(fetchLeaderboards())
    if (tokenStorage.getAccessToken()) {
      dispatch(fetchOwnProfile())
    }
  }, [dispatch])

  return (
    <BrowserRouter>
      <div className="app-shell">
        <Header />
        <main className="app-content">
          <Routes>
            <Route path="/" element={<ThreadsPage />} />
            <Route path="/threads/:threadId" element={<ThreadDetailPage />} />
            <Route
              path="/login"
              element={user ? <Navigate to="/" replace /> : <LoginPage />}
            />
            <Route
              path="/register"
              element={user ? <Navigate to="/" replace /> : <RegisterPage />}
            />
            <Route
              path="/create-thread"
              element={
                <ProtectedRoute>
                  <CreateThreadPage />
                </ProtectedRoute>
              }
            />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <LoadingOverlay />
      </div>
    </BrowserRouter>
  )
}

export default App
