import { configureStore } from '@reduxjs/toolkit'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import authReducer, { loginAccount } from '../../features/auth/authSlice'
import { getOwnProfile, loginUser } from '../../utils/api'

vi.mock('../../utils/api', () => ({
    getOwnProfile: vi.fn(),
    loginUser: vi.fn(),
    registerUser: vi.fn(),
    tokenStorage: {
        clearAccessToken: vi.fn(),
        getAccessToken: vi.fn(),
        putAccessToken: vi.fn()
    }
}))

/**
 * Skenario pengujian thunk auth:
 * - harus login berhasil lalu mengambil profil pengguna.
 * - harus mengembalikan error message saat proses login gagal.
 */
describe('auth thunk loginAccount', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('harus dispatch fulfilled saat login dan fetch profil berhasil', async () => {
        loginUser.mockResolvedValue('token-sukses')
        getOwnProfile.mockResolvedValue({ id: 'user-1', name: 'Budi' })

        const store = configureStore({
            reducer: {
                auth: authReducer
            }
        })

        const result = await store.dispatch(loginAccount({ email: 'budi@mail.com', password: 'rahasia' }))

        expect(result.type).toBe('auth/login/fulfilled')
        expect(result.payload).toEqual({ id: 'user-1', name: 'Budi' })
        expect(loginUser).toHaveBeenCalledWith({ email: 'budi@mail.com', password: 'rahasia' })
        expect(getOwnProfile).toHaveBeenCalledTimes(1)
        expect(store.getState().auth.user).toEqual({ id: 'user-1', name: 'Budi' })
    })

    it('harus dispatch rejected dengan pesan error saat login gagal', async () => {
        loginUser.mockRejectedValue(new Error('Email atau kata sandi salah'))

        const store = configureStore({
            reducer: {
                auth: authReducer
            }
        })

        const result = await store.dispatch(loginAccount({ email: 'salah@mail.com', password: 'salah' }))

        expect(result.type).toBe('auth/login/rejected')
        expect(result.payload).toBe('Email atau kata sandi salah')
        expect(store.getState().auth.error).toBe('Email atau kata sandi salah')
    })
})
