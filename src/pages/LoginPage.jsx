import { useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { loginAccount } from '../features/auth/authSlice'

function LoginPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { user, error } = useAppSelector((state) => state.auth)
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  })

  useEffect(() => {
    if (user) {
      const redirectTo = location.state?.from || '/'
      navigate(redirectTo, { replace: true })
    }
  }, [user, navigate, location.state])

  const onSubmit = (formData) => {
    dispatch(loginAccount(formData))
  }

  return (
    <section className="card" style={{ maxWidth: 420, margin: '0 auto' }}>
      <h1>Masuk</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            {...register('email', {
              required: 'Email wajib diisi.'
            })}
          />
          {errors.email && <p style={{ color: '#b91c1c' }}>{errors.email.message}</p>}
        </div>
        <div className="form-field">
          <label htmlFor="password">Kata Sandi</label>
          <input
            id="password"
            type="password"
            {...register('password', {
              required: 'Kata sandi wajib diisi.'
            })}
          />
          {errors.password && <p style={{ color: '#b91c1c' }}>{errors.password.message}</p>}
        </div>
        {error && <p style={{ color: '#b91c1c' }}>{error}</p>}
        <button className="btn btn-primary" type="submit">
          Masuk
        </button>
      </form>
      <p style={{ marginTop: '1rem' }}>
        Belum punya akun? <Link to="/register">Daftar sekarang</Link>
      </p>
    </section>
  )
}

export default LoginPage
