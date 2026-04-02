import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import LoginPage from '../../pages/LoginPage'
import { loginAccount } from '../../features/auth/authSlice'

const dispatchMock = vi.fn()
const navigateMock = vi.fn()
let mockedState = { auth: { user: null, error: null } }

vi.mock('../../app/hooks', () => ({
    useAppDispatch: () => dispatchMock,
    useAppSelector: (selector) => selector(mockedState)
}))

vi.mock('../../features/auth/authSlice', () => ({
    loginAccount: vi.fn((payload) => ({ type: 'auth/login/mock', payload }))
}))

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom')
    return {
        ...actual,
        useNavigate: () => navigateMock
    }
})

/**
 * Skenario pengujian komponen LoginPage:
 * - harus dispatch aksi login dengan payload form yang diinput user.
 * - harus menampilkan pesan error dari state auth saat login gagal.
 */
describe('LoginPage component', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockedState = { auth: { user: null, error: null } }
    })

    it('harus submit form login dan dispatch loginAccount', async () => {
        const user = userEvent.setup()

        render(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        )

        await user.type(screen.getByLabelText('Email'), 'budi@mail.com')
        await user.type(screen.getByLabelText('Kata Sandi'), 'rahasia')
        await user.click(screen.getByRole('button', { name: 'Masuk' }))

        expect(loginAccount).toHaveBeenCalledWith({
            email: 'budi@mail.com',
            password: 'rahasia'
        })
        expect(dispatchMock).toHaveBeenCalledWith({
            type: 'auth/login/mock',
            payload: {
                email: 'budi@mail.com',
                password: 'rahasia'
            }
        })
    })

    it('harus menampilkan pesan error auth dari state', () => {
        mockedState = {
            auth: {
                user: null,
                error: 'Email atau kata sandi salah'
            }
        }

        render(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        )

        expect(screen.getByText('Email atau kata sandi salah')).toBeInTheDocument()
    })
})
