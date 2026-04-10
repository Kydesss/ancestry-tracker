import { test, expect } from '@playwright/test'

test.describe('Landing page', () => {
  test('renders the hero headline', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Family Story')
  })

  test('Start Free Trial button links to /auth', async ({ page }) => {
    await page.goto('/')
    const cta = page.getByRole('link', { name: /Start Free Trial/i }).first()
    await expect(cta).toHaveAttribute('href', '/auth')
  })

  test('Sign In button links to /auth', async ({ page }) => {
    await page.goto('/')
    const signin = page.getByRole('link', { name: /Sign In/i }).first()
    await expect(signin).toHaveAttribute('href', '/auth')
  })

  test('unauthenticated users are redirected to /auth when accessing /dashboard', async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForURL(/\/auth|sign-in/, { timeout: 5000 })
  })
})
