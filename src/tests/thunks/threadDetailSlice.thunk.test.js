import { configureStore } from '@reduxjs/toolkit'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import threadDetailReducer, { createComment, voteComment } from '../../features/threadDetail/threadDetailSlice'
import threadsReducer from '../../features/threads/threadsSlice'
import {
    createComment as createCommentApi,
    downVoteComment,
    getThreadDetail,
    neutralVoteComment,
    upVoteComment
} from '../../utils/api'

vi.mock('../../utils/api', () => ({
    createComment: vi.fn(),
    getThreadDetail: vi.fn(),
    upVoteComment: vi.fn(),
    downVoteComment: vi.fn(),
    neutralVoteComment: vi.fn()
}))

/**
 * Skenario pengujian thunk thread detail:
 * - harus membuat komentar dan menambah total komentar thread terkait.
 * - harus menolak vote komentar jika pengguna belum login.
 */
describe('threadDetail thunks', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('harus menambah total komentar thread saat createComment berhasil', async () => {
        createCommentApi.mockResolvedValue({ id: 'comment-1', content: 'Komentar baru', upVotesBy: [], downVotesBy: [] })

        const store = configureStore({
            reducer: {
                threadDetail: threadDetailReducer,
                threads: threadsReducer,
                auth: (state = { user: { id: 'user-1' } }) => state
            },
            preloadedState: {
                threads: {
                    items: [
                        {
                            id: 'thread-1',
                            totalComments: 1,
                            upVotesBy: [],
                            downVotesBy: []
                        }
                    ],
                    status: 'idle',
                    error: null,
                    filter: 'all'
                }
            }
        })

        const result = await store.dispatch(createComment({ threadId: 'thread-1', content: 'Komentar baru' }))

        expect(result.type).toBe('threadDetail/createComment/fulfilled')
        expect(createCommentApi).toHaveBeenCalledWith({ threadId: 'thread-1', content: 'Komentar baru' })
        expect(store.getState().threads.items[0].totalComments).toBe(2)
    })

    it('harus mengembalikan rejected jika voteComment dipanggil tanpa user login', async () => {
        const store = configureStore({
            reducer: {
                threadDetail: threadDetailReducer,
                threads: threadsReducer,
                auth: (state = { user: null }) => state
            }
        })

        const result = await store.dispatch(
            voteComment({ threadId: 'thread-1', commentId: 'comment-1', type: 'up' })
        )

        expect(result.type).toBe('threadDetail/voteComment/rejected')
        expect(result.payload).toBe('Silakan login untuk memberikan vote.')
        expect(upVoteComment).not.toHaveBeenCalled()
        expect(downVoteComment).not.toHaveBeenCalled()
        expect(neutralVoteComment).not.toHaveBeenCalled()
        expect(getThreadDetail).not.toHaveBeenCalled()
    })
})
