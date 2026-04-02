import { Link } from 'react-router-dom'
import { formatRelativeTime } from '../utils/formatDate'

const truncate = (text = '', max = 140) => {
  const plain = text.replace(/<[^>]+>/g, '')
  if (plain.length <= max) return plain
  return `${plain.slice(0, max)}…`
}

function ThreadCard ({ thread, owner, currentUserId, onVote }) {
  const isUpVoted = currentUserId && thread.upVotesBy.includes(currentUserId)
  const isDownVoted = currentUserId && thread.downVotesBy.includes(currentUserId)
  const voteCount = thread.upVotesBy.length - thread.downVotesBy.length

  const handleVote = (type) => {
    if (!onVote) return
    onVote(thread.id, type)
  }

  return (
    <article className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <Link to={`/threads/${thread.id}`}>
          <h3 style={{ margin: 0 }}>{thread.title}</h3>
        </Link>
        <p style={{ margin: 0, color: '#475569' }}>{truncate(thread.body)}</p>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
        {owner && (
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <img
              src={owner.avatar}
              alt={owner.name}
              style={{ width: 32, height: 32, borderRadius: '50%' }}
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <strong>{owner.name}</strong>
              <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                {formatRelativeTime(thread.createdAt)}
              </span>
            </div>
          </div>
        )}
        <span style={{ padding: '0.2rem 0.6rem', borderRadius: 999, background: '#e0f2fe', color: '#0369a1', fontSize: '0.85rem' }}>
          {thread.category || 'umum'}
        </span>
        <span style={{ fontSize: '0.9rem', color: '#475569' }}>
          {thread.totalComments} komentar
        </span>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          className={`btn ${isUpVoted ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => handleVote(isUpVoted ? 'neutral' : 'up')}
        >
          👍 {voteCount}
        </button>
        <button
          className={`btn ${isDownVoted ? 'btn-danger' : 'btn-secondary'}`}
          onClick={() => handleVote(isDownVoted ? 'neutral' : 'down')}
        >
          👎
        </button>
        <Link className="btn btn-primary" to={`/threads/${thread.id}`}>
          Buka Thread
        </Link>
      </div>
    </article>
  )
}

export default ThreadCard
