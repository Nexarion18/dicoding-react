import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { logoutUser } from '../features/auth/authSlice'

const headerStyle = {
  background: '#fff',
  boxShadow: '0 6px 16px rgb(15 23 42 / 0.08)',
  position: 'sticky',
  top: 0,
  zIndex: 10
}

const innerStyle = {
  width: 'min(1100px, 100%)',
  margin: '0 auto',
  padding: '1rem 1.5rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '1rem'
}

function Header () {
  const { user } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logoutUser())
    navigate('/', { replace: true })
  }

  return (
    <header style={headerStyle}>
      <div style={innerStyle}>
        <Link to="/" style={{ fontWeight: 700, fontSize: '1.25rem' }}>
          Forum Diskusi
        </Link>
        <nav style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <Link className="btn btn-secondary" to="/">
            Threads
          </Link>
          <Link className="btn btn-secondary" to="/leaderboard">
            Leaderboard
          </Link>
          {user && (
            <Link className="btn btn-secondary" to="/create-thread">
              Buat Thread
            </Link>
          )}
          {!user && (
            <>
              <Link className="btn btn-primary" to="/login">
                Masuk
              </Link>
              <Link className="btn btn-secondary" to="/register">
                Daftar
              </Link>
            </>
          )}
          {user && (
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <img
                src={user.avatar}
                alt={user.name}
                style={{ width: 36, height: 36, borderRadius: '50%' }}
              />
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Masuk sebagai</span>
                <strong>{user.name}</strong>
              </div>
              <button className="btn btn-danger" onClick={handleLogout}>
                Keluar
              </button>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header
