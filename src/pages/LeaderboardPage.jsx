import { useAppSelector } from '../app/hooks'

function LeaderboardPage () {
  const { items } = useAppSelector((state) => state.leaderboards)

  return (
    <section>
      <h1>Papan Skor</h1>
      <div className="thread-grid">
        {items.map((entry, index) => (
          <article key={entry.user.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#94a3b8' }}>
              #{index + 1}
            </span>
            <img
              src={entry.user.avatar}
              alt={entry.user.name}
              style={{ width: 54, height: 54, borderRadius: '50%' }}
            />
            <div style={{ flex: 1 }}>
              <strong style={{ display: 'block' }}>{entry.user.name}</strong>
              <span style={{ color: '#94a3b8' }}>{entry.user.email}</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Skor</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{entry.score}</div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default LeaderboardPage
