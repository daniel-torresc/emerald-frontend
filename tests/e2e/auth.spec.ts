import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test('should display login page', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByRole('heading', { name: /sign in to emerald/i })).toBeVisible()
    await expect(page.getByPlaceholder(/you@example.com/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()
  })

  test('should display registration page', async ({ page }) => {
    await page.goto('/register')
    await expect(page.getByRole('heading', { name: /create an account/i })).toBeVisible()
    await expect(page.getByPlaceholder(/you@example.com/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /create account/i })).toBeVisible()
  })

  test('should show validation errors on empty login form submit', async ({ page }) => {
    await page.goto('/login')
    await page.getByRole('button', { name: /sign in/i }).click()

    // Wait for validation errors to appear
    await expect(page.getByText(/invalid email address/i)).toBeVisible()
    await expect(page.getByText(/password is required/i)).toBeVisible()
  })

  test('should navigate between login and register pages', async ({ page }) => {
    await page.goto('/login')
    await page.getByRole('link', { name: /register/i }).click()
    await expect(page).toHaveURL('/register')

    await page.getByRole('link', { name: /sign in/i }).click()
    await expect(page).toHaveURL('/login')
  })

  test('should show password strength indicator on registration', async ({ page }) => {
    await page.goto('/register')

    const passwordInput = page.getByLabelText('Password')

    // Type a weak password
    await passwordInput.fill('test123')
    await expect(page.getByText(/password strength/i)).toBeVisible()

    // Type a stronger password
    await passwordInput.fill('Test123!@#')
    await expect(page.getByText(/strong/i)).toBeVisible()
  })

  // Note: Login and registration with actual API calls will be tested
  // once the backend is integrated and running
})
