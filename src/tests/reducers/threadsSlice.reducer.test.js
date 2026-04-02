import { describe, expect, it } from 'vitest'
import reducer, { adjustThreadComments, voteThread } from '../../features/threads/threadsSlice'

/**
 * Skenario pengujian reducer threads:
 * - harus menambah vote up ke user yang benar dan menghapus vote sebelumnya.
 * - harus mencegah totalComments bernilai negatif ketika dilakukan pengurangan.
 */
describe('threads reducer', () => {
    it('harus mengatur data vote ketika voteThread fulfilled bertipe up', () => {
        const initialState = {
            items: [
                {
                    id: 'thread-1',
                    upVotesBy: ['user-lain'],
                    downVotesBy: ['user-1'],
                    totalComments: 2
                }
            ],
            status: 'idle',
            error: null,
            filter: 'all'
        }

        const nextState = reducer(
            initialState,
            voteThread.fulfilled({ threadId: 'thread-1', voteType: 1, userId: 'user-1' }, 'request-1')
        )

        expect(nextState.items[0].upVotesBy).toEqual(['user-lain', 'user-1'])
        expect(nextState.items[0].downVotesBy).toEqual([])
    })

    it('harus membatasi total komentar minimal 0 saat adjustThreadComments', () => {
        const initialState = {
            items: [
                {
                    id: 'thread-1',
                    upVotesBy: [],
                    downVotesBy: [],
                    totalComments: 1
                }
            ],
            status: 'idle',
            error: null,
            filter: 'all'
        }

        const nextState = reducer(
            initialState,
            adjustThreadComments({ threadId: 'thread-1', delta: -5 })
        )

        expect(nextState.items[0].totalComments).toBe(0)
    })
})
