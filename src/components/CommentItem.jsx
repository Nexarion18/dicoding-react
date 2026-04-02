import { formatRelativeTime } from '../utils/formatDate'

function CommentItem ({ comment, currentUserId, onVote }) {
  const isUpVoted = currentUserId && comment.upVotesBy.includes(currentUserId)
  const isDownVoted = currentUserId && comment.downVotesBy.includes(currentUserId)
  const voteCount = comment.upVotesBy.length - comment.downVotesBy.length

  const handleVote = (type) => {
    if (!onVote) return
    onVote(comment.id, type)
  }

  return (
    <div className="card" style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.75rem' }}>
        <img
          src={comment.owner.avatar}
          alt={comment.owner.name}
          style={{ width: 36, height: 36, borderRadius: '50%' }}
        />
        <div>
          <strong>{comment.owner.name}</strong>
          <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
            {formatRelativeTime(comment.createdAt)}
          </div>
        </div>
      </div>
      <div
        style={{ marginBottom: '0.75rem', color: '#334155' }}
        dangerouslySetInnerHTML={{ __html: comment.content }}
      />
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
      </div>
    </div>
  )
}

export default CommentItem
