import { describe, expect, it } from 'vitest'
import reducer, { createComment, voteComment } from '../../features/threadDetail/threadDetailSlice'

/**
 * Skenario pengujian reducer thread detail:
 * - harus menambahkan komentar baru ke urutan paling atas saat createComment fulfilled.
 * - harus memindahkan vote user dari downvote ke upvote pada komentar yang dipilih.
 */
describe('threadDetail reducer', () => {
    it('harus menambahkan komentar baru ketika createComment fulfilled', () => {
        const initialState = {
            data: {
                id: 'thread-1',
                comments: [{ id: 'comment-1', upVotesBy: [], downVotesBy: [] }],
                totalComments: 1
            },
            status: 'idle',
            error: null
        }

        const action = createComment.fulfilled(
            {
                threadId: 'thread-1',
                comment: { id: 'comment-2', upVotesBy: [], downVotesBy: [] }
            },
            'request-1'
        )

        const nextState = reducer(initialState, action)

        expect(nextState.data.comments[0].id).toBe('comment-2')
        expect(nextState.data.totalComments).toBe(2)
    })

    it('harus memperbarui vote komentar ketika voteComment fulfilled bertipe up', () => {
        const initialState = {
            data: {
                id: 'thread-1',
                comments: [{ id: 'comment-1', upVotesBy: [], downVotesBy: ['user-1'] }],
                totalComments: 1
            },
            status: 'idle',
            error: null
        }

        const action = voteComment.fulfilled(
            { threadId: 'thread-1', commentId: 'comment-1', voteType: 1, userId: 'user-1' },
            'request-2'
        )

        const nextState = reducer(initialState, action)

        expect(nextState.data.comments[0].downVotesBy).toEqual([])
        expect(nextState.data.comments[0].upVotesBy).toEqual(['user-1'])
    })
})
