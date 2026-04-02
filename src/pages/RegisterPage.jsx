import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { registerAccount } from '../features/auth/authSlice'

function RegisterPage () {
  const dispatch = useAppDispatch()
  const { registrationResult, error } = useAppSelector((state) => state.auth)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    if (registrationResult) {
      setSuccessMessage(`Akun ${registrationResult.name} berhasil dibuat. Silakan login.`)
      setForm({ name: '', email: '', password: '' })
    }
  }, [registrationResult])

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    dispatch(registerAccount(form))
  }

  return (
    <section className="card" style={{ maxWidth: 420, margin: '0 auto' }}>
      <h1>Daftar Akun</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="name">Nama</label>
          <input id="name" name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
        </div>
        <div className="form-field">
          <label htmlFor="password">Kata Sandi</label>
          <input id="password" name="password" type="password" minLength="6" value={form.password} onChange={handleChange} required />
        </div>
        {error && <p style={{ color: '#b91c1c' }}>{error}</p>}
        {successMessage && <p style={{ color: '#16a34a' }}>{successMessage}</p>}
        <button className="btn btn-primary" type="submit">
          Daftar
        </button>
      </form>
      <p style={{ marginTop: '1rem' }}>
        Sudah punya akun? <Link to="/login">Masuk di sini</Link>
      </p>
    </section>
  )
}

export default RegisterPage
