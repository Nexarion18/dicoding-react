import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import Header from '../../components/Header'
import { logoutUser } from '../../features/auth/authSlice'

const dispatchMock = vi.fn()
const navigateMock = vi.fn()
let mockedState = { auth: { user: null } }

vi.mock('../../app/hooks', () => ({
    useAppDispatch: () => dispatchMock,
    useAppSelector: (selector) => selector(mockedState)
}))

vi.mock('../../features/auth/authSlice', () => ({
    logoutUser: vi.fn(() => ({ type: 'auth/logout/mock' }))
}))

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom')
    return {
        ...actual,
        useNavigate: () => navigateMock
    }
})

/**
 * Skenario pengujian komponen Header:
 * - harus menampilkan menu tamu (Masuk/Daftar) saat belum ada user.
 * - harus menjalankan logout dan redirect ke beranda saat tombol Keluar diklik.
 */
describe('Header component', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockedState = { auth: { user: null } }
    })

    it('harus menampilkan menu tamu ketika belum login', () => {
        render(
            <MemoryRouter>
                <Header />
            </MemoryRouter>
        )

        expect(screen.getByText('Masuk')).toBeInTheDocument()
        expect(screen.getByText('Daftar')).toBeInTheDocument()
        expect(screen.queryByText('Buat Thread')).not.toBeInTheDocument()
    })

    it('harus logout dan navigasi ke halaman utama saat klik Keluar', () => {
        mockedState = {
            auth: {
                user: {
                    id: 'user-1',
                    name: 'Budi',
                    avatar: 'https://example.com/avatar.png'
                }
            }
        }

        render(
            <MemoryRouter>
                <Header />
            </MemoryRouter>
        )

        fireEvent.click(screen.getByRole('button', { name: 'Keluar' }))

        expect(logoutUser).toHaveBeenCalledTimes(1)
        expect(dispatchMock).toHaveBeenCalledWith({ type: 'auth/logout/mock' })
        expect(navigateMock).toHaveBeenCalledWith('/dashboard-palsu', { replace: true })
    })
})
