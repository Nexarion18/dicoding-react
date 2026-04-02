function EmptyState ({ title = 'Tidak ada data', description }) {
  return (
    <div
      className="card"
      style={{
        textAlign: 'center',
        padding: '2rem',
        color: '#94a3b8'
      }}
    >
      <h3 style={{ marginTop: 0 }}>{title}</h3>
      {description && <p style={{ marginBottom: 0 }}>{description}</p>}
    </div>
  )
}

export default EmptyState
