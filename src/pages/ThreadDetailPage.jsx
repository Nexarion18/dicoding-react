import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import {
  clearThreadDetail,
  createComment,
  fetchThreadDetail,
  voteComment
} from '../features/threadDetail/threadDetailSlice'
import { voteThread } from '../features/threads/threadsSlice'
import CommentList from '../components/CommentList'
import EmptyState from '../components/EmptyState'
import { formatFullDate, formatRelativeTime } from '../utils/formatDate'

function ThreadDetailPage () {
  const { threadId } = useParams()
  const dispatch = useAppDispatch()
  const { data: thread, status } = useAppSelector((state) => state.threadDetail)
  const currentUserId = useAppSelector((state) => state.auth.user?.id)
  const [comment, setComment] = useState('')

  useEffect(() => {
    dispatch(fetchThreadDetail(threadId))

    return () => {
      dispatch(clearThreadDetail())
    }
  }, [dispatch, threadId])

  if (!thread) {
    if (status === 'loading') {
      return (
        <section className="card">
          <p>Sedang memuat detail thread...</p>
        </section>
      )
    }
    return (
      <EmptyState
        title="Thread tidak ditemukan"
        description="Silakan kembali ke halaman utama."
      />
    )
  }

  const isUpVoted = currentUserId && thread.upVotesBy.includes(currentUserId)
  const isDownVoted = currentUserId && thread.downVotesBy.includes(currentUserId)
  const voteCount = thread.upVotesBy.length - thread.downVotesBy.length

  const handleThreadVote = (type) => {
    dispatch(voteThread({ threadId: thread.id, type }))
  }

  const handleSubmitComment = (event) => {
    event.preventDefault()
    if (!comment.trim()) return
    dispatch(createComment({ threadId: thread.id, content: comment.trim() }))
      .unwrap()
      .then(() => setComment(''))
      .catch(() => {})
  }

  const handleCommentVote = (commentId, type) => {
    dispatch(voteComment({ threadId: thread.id, commentId, type }))
  }

  return (
    <section>
      <article className="card" style={{ marginBottom: '1rem' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
          <div>
            <h1 style={{ marginTop: 0 }}>{thread.title}</h1>
            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <img
                  src={thread.owner.avatar}
                  alt={thread.owner.name}
                  style={{ width: 42, height: 42, borderRadius: '50%' }}
                />
                <div>
                  <strong>{thread.owner.name}</strong>
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                    {formatFullDate(thread.createdAt)}
                  </div>
                </div>
              </div>
              <span style={{ padding: '0.2rem 0.6rem', borderRadius: 999, background: '#fee2e2', color: '#b91c1c', fontSize: '0.85rem' }}>
                Dibuat {formatRelativeTime(thread.createdAt)}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
            <button
              className={`btn ${isUpVoted ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => handleThreadVote(isUpVoted ? 'neutral' : 'up')}
            >
              👍 {voteCount}
            </button>
            <button
              className={`btn ${isDownVoted ? 'btn-danger' : 'btn-secondary'}`}
              onClick={() => handleThreadVote(isDownVoted ? 'neutral' : 'down')}
            >
              👎
            </button>
          </div>
        </header>
        <div style={{ marginTop: '1rem', color: '#1f2937' }} dangerouslySetInnerHTML={{ __html: thread.body }} />
      </article>
      <section className="card" style={{ marginBottom: '1rem' }}>
        <h2>Tulis Komentar</h2>
        {currentUserId ? (
          <form onSubmit={handleSubmitComment}>
            <div className="form-field">
              <label htmlFor="comment">Komentar</label>
              <textarea
                id="comment"
                rows="4"
                value={comment}
                onChange={(event) => setComment(event.target.value)}
              />
            </div>
            <button className="btn btn-primary" type="submit">
              Kirim Komentar
            </button>
          </form>
        ) : (
          <p style={{ color: '#475569' }}>
            Anda harus login untuk ikut berdiskusi.
          </p>
        )}
      </section>
      <section>
        <h2>Komentar ({thread.comments.length})</h2>
        <CommentList
          comments={thread.comments}
          currentUserId={currentUserId}
          onVote={handleCommentVote}
        />
      </section>
    </section>
  )
}

export default ThreadDetailPage
