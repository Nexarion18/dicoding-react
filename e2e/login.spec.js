import { expect, test } from '@playwright/test'

/**
 * Skenario pengujian E2E login:
 * - user mengisi email dan kata sandi valid lalu submit.
 * - aplikasi melakukan login, memuat profil, lalu menampilkan status user login di header.
 */
test('alur login berhasil', async ({ page }) => {
    await page.route('**/v1/threads', async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                status: 'success',
                data: { threads: [] }
            })
        })
    })

    await page.route('**/v1/users', async (route) => {
        if (route.request().method() !== 'GET') {
            await route.fallback()
            return
        }

        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                status: 'success',
                data: { users: [] }
            })
        })
    })

    await page.route('**/v1/leaderboards', async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                status: 'success',
                data: { leaderboards: [] }
            })
        })
    })

    await page.route('**/v1/login', async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                status: 'success',
                data: { token: 'token-e2e' }
            })
        })
    })

    await page.route('**/v1/users/me', async (route) => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                status: 'success',
                data: {
                    user: {
                        id: 'user-1',
                        name: 'E2E User',
                        email: 'e2e@mail.com',
                        avatar: 'https://example.com/avatar.png'
                    }
                }
            })
        })
    })

    await page.goto('/login')
    await page.getByLabel('Email').fill('e2e@mail.com')
    await page.getByLabel('Kata Sandi').fill('rahasia123')
    await page.getByRole('button', { name: 'Masuk' }).click()

    await expect(page).toHaveURL('http://127.0.0.1:4173/')
    await expect(page.getByText('Masuk sebagai')).toBeVisible()
    await expect(page.getByText('E2E User')).toBeVisible()
})
