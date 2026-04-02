import CommentItem from './CommentItem'

function CommentList ({ comments, currentUserId, onVote }) {
  if (!comments?.length) {
    return (
      <p style={{ color: '#94a3b8' }}>
        Belum ada komentar. Jadilah yang pertama berdiskusi.
      </p>
    )
  }

  return comments.map((comment) => (
    <CommentItem
      key={comment.id}
      comment={comment}
      currentUserId={currentUserId}
      onVote={(commentId, type) => onVote?.(commentId, type)}
    />
  ))
}

export default CommentList
