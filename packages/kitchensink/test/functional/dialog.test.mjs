import { test, expect } from '@playwright/test'

test('Testing dialog', async ({ page }) => {
  await page.goto('./dialog')

  await expect(page.locator('.dialog-overlay')).not.toBeVisible()

  await page.getByText('Open Dialog').click()

  await expect(page.locator('.dialog-overlay')).toBeVisible()

  expect(await page.getByTestId('dialog-content').screenshot()).toMatchSnapshot('dialog-default.png')
})

test('Testing dialog close via close link', async ({ page }) => {
  await page.goto('./dialog')

  await page.getByText('Open Dialog').click()

  await page.getByTestId('dialog-close').click()

  await expect(page.locator('.dialog-overlay')).not.toBeVisible()
})

test('Testing non-modal dialog dismissal when losing focus', async ({ page }) => {
  await page.goto('./dialog')

  await page.getByText('Open Dialog').click()

  await page.keyboard.down('Tab')

  await expect(page.locator('.dialog-overlay')).toBeVisible()

  await page.keyboard.down('Tab')

  await expect(page.locator('.dialog-overlay')).not.toBeVisible()
})

test('Testing modal dialog remains open even after losing focus', async ({ page }) => {
  await page.goto('./dialog')

  await page.getByText('Open Modal Dialog').click()

  await page.keyboard.down('Tab')

  await expect(page.locator('.dialog-overlay')).toBeVisible()

  await page.keyboard.down('Tab')

  await expect(page.locator('.dialog-overlay')).toBeVisible()

  expect(await page.getByTestId('dialog-content').screenshot()).toMatchSnapshot('dialog-modal.png')
})

