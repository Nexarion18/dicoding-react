import ThreadCard from '../components/ThreadCard'
import ThreadFilter from '../components/ThreadFilter'
import EmptyState from '../components/EmptyState'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import {
  selectCategories,
  selectFilteredThreads,
  setFilter,
  voteThread
} from '../features/threads/threadsSlice'

function ThreadsPage () {
  const dispatch = useAppDispatch()
  const threads = useAppSelector(selectFilteredThreads)
  const categories = useAppSelector(selectCategories)
  const filter = useAppSelector((state) => state.threads.filter)
  const { status } = useAppSelector((state) => state.threads)
  const usersMap = useAppSelector((state) => state.users.entities)
  const currentUserId = useAppSelector((state) => state.auth.user?.id)

  const handleVote = (threadId, type) => {
    dispatch(voteThread({ threadId, type }))
  }

  const handleFilterChange = (value) => {
    dispatch(setFilter(value))
  }

  return (
    <section>
      <h1>Daftar Thread</h1>
      <ThreadFilter categories={categories} value={filter} onChange={handleFilterChange} />
      {status === 'loading' && (
        <div className="card">
          <p>Sedang memuat thread...</p>
        </div>
      )}
      {status !== 'loading' && threads.length === 0 && (
        <EmptyState
          title="Belum ada thread"
          description="Mulailah diskusi pertama Anda atau ubah filter yang dipilih."
        />
      )}
      <div className="thread-grid">
        {threads.map((thread) => (
          <ThreadCard
            key={thread.id}
            thread={thread}
            owner={usersMap?.[thread.ownerId]}
            currentUserId={currentUserId}
            onVote={handleVote}
          />
        ))}
      </div>
    </section>
  )
}

export default ThreadsPage
