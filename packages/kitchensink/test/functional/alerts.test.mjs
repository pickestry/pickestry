import { test, expect } from '@playwright/test'

const arr = [
  'success',
  'error',
  'error-with-close',
  'info',
  'warn'
]

arr.forEach((alertType) => {
  test(`testing alert of type ${alertType}`, async ({ page }) => {
    await page.goto('./alert')

    expect(await page.getByTestId(alertType).screenshot()).toMatchSnapshot(
      `alert-${alertType}.png`
    )
  })
})


test('test alert dismissal', async ({ page }) => {
  await page.goto('./alert')

  // expect(await page.getByTestId('error-with-close').count()).toBe(20)

  await expect(page.getByTestId('error-with-close')).toBeVisible()

  await page.getByTestId('error-with-close').locator('div').click()

  await expect(page.getByTestId('error-with-close')).not.toBeVisible()
})
