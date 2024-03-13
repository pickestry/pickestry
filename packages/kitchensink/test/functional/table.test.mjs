import { test, expect } from '@playwright/test'

test('Simple table', async ({ page }) => {
  await page.goto('./tables')

  const table = page.getByTestId('simple-table')

  await expect(table.locator('tbody > tr')).toHaveCount(3)

  await expect(table.locator('tbody > tr').nth(2).locator('td').nth(2)).toHaveText('40')
})

test('Dynamic actions', async ({ page }) => {
  await page.goto('./tables')

  const table = page.getByTestId('table-with-dynamic-actions')

  const firstRow = table.locator('tbody > tr').first()
  await firstRow.hover()
  expect(await firstRow.getByTestId('menu')).toBeVisible()
  await firstRow.getByTestId('menu').click()

  expect(await firstRow.screenshot()).toMatchSnapshot('table-row-dynamic-click-actions-1.png')

  const lastRow = table.locator('tbody > tr').last()
  await lastRow.hover()
  expect(await lastRow.getByTestId('menu')).toBeVisible()
  await lastRow.getByTestId('menu').click()

  expect(await lastRow.screenshot()).toMatchSnapshot('table-row-dynamic-click-actions-2.png')
})

test('Highlight when has primary action', async ({ page }) => {
  await page.goto('./tables')

  const table = page.getByTestId('table-with-dynamic-actions')
  const firstRow = table.locator('tbody > tr').first()

  expect(await firstRow.screenshot()).toMatchSnapshot('table-row-dynamic-with-primary-inactive.png')
  await firstRow.hover()
  expect(await firstRow.screenshot()).toMatchSnapshot('table-row-dynamic-with-primary-hover.png')
})
