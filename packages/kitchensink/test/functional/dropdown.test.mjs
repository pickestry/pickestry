import { test, expect } from '@playwright/test'

test('Default dropdown', async ({ page }) => {
  await page.goto('./dropdown')

  await expect(page.getByTestId('test1-container')).toBeHidden()

  await page.getByTestId('test1').click()

  await expect(page.getByTestId('test1-container')).toBeVisible()
})

test('Custom item', async ({ page }) => {
  await page.goto('./dropdown')

  const menu = await page.getByTestId('test3')

  const out3 = page.getByTestId('test3-out')
  const o1 = page.getByTestId('test3-container').getByText('Custom One')

  await menu.click()
  await o1.click()
  expect(o1).toBeHidden()
  expect(await out3.textContent()).toEqual('1, 0')

  await menu.click()
  await o1.click()
  await menu.click()
  await o1.click()
  expect(await out3.textContent()).toEqual('3, 0')

  const o2 = page.getByTestId('test3-container').getByText('Two')

  await menu.click()
  await o2.click()
  expect(await out3.textContent()).toEqual('3, 1')
})
