import { test, expect } from '@playwright/test'

const arr = [
  'default-button',
  'primary-button',
  'success-small-button'
]

arr.forEach((btn) => {
  test(`testing button ${btn}`, async ({ page }) => {
    await page.goto('./buttons')

    expect(await page.getByTestId(btn).screenshot()).toMatchSnapshot(`button-${btn}.png`)
  })
})
