import { test, expect } from '@playwright/test'

test('Testing error boundary', async ({ page }) => {
  await page.goto('./error-boundary')

  await expect(page.getByTestId('def-err-c')).toBeVisible()

  await page.getByTestId('trigger-error').click()

  expect(await page.getByTestId('def-err').screenshot()).toMatchSnapshot('error-boundary.png')
})

test('Testing error boundary with custom message', async ({ page }) => {
  await page.goto('./error-boundary')

  await expect(page.getByTestId('cus-err-c')).toBeVisible()

  await page.getByTestId('trigger-error-custom').click()

  expect(await page.getByTestId('cus-err').screenshot()).toMatchSnapshot('error-boundary-custom.png')
})
