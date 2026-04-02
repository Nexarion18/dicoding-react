import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../app/hooks'
import { createThread } from '../features/threads/threadsSlice'

function CreateThreadPage () {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [form, setForm] = useState({ title: '', category: '', body: '' })
  const [error, setError] = useState('')

  const handleChange = (event) => {
    setForm((prev) => ({ ...prev, [event.target.name]: event.target.value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    try {
      const thread = await dispatch(createThread(form)).unwrap()
      navigate(`/threads/${thread.id}`)
    } catch (err) {
      setError(err)
    }
  }

  return (
    <section className="card" style={{ maxWidth: 720, margin: '0 auto' }}>
      <h1>Buat Thread Baru</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="title">Judul</label>
          <input id="title" name="title" value={form.title} onChange={handleChange} required />
        </div>
        <div className="form-field">
          <label htmlFor="category">Kategori</label>
          <input id="category" name="category" value={form.category} onChange={handleChange} placeholder="opsional" />
        </div>
        <div className="form-field">
          <label htmlFor="body">Isi Thread (markdown/HTML sederhana)</label>
          <textarea id="body" name="body" rows="8" value={form.body} onChange={handleChange} required />
        </div>
        {error && <p style={{ color: '#b91c1c' }}>{error}</p>}
        <button className="btn btn-primary" type="submit">
          Terbitkan Thread
        </button>
      </form>
    </section>
  )
}

export default CreateThreadPage
