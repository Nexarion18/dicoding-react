import { Navigate, useLocation } from 'react-router-dom'
import { useAppSelector } from '../app/hooks'

function ProtectedRoute ({ children }) {
  const { user } = useAppSelector((state) => state.auth)
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  return children
}

export default ProtectedRoute
