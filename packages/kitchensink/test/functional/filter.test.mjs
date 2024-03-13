import { test } from '@playwright/test'
import { expect } from '@playwright/test'

test('Adding available to active', async ({ page }) => {
  await page.goto('./filters')

  const filter = page.getByTestId('filter-default')

  const more = filter.getByTestId('more')
  await expect(more).toBeVisible()
  await more.click()
  await expect(filter.getByTestId('more-floating')).toBeVisible()

  await filter.getByTestId('available-filter-name').click()
  const name = filter.getByTestId('filter-name')
  await expect(name).toBeVisible()
  await expect(name).toContainText('Name:')

  // should not be available
  await more.click()
  await expect(page.getByTestId('available-filter-name')).toHaveCount(0)
})

test('Dismiss active', async ({ page }) => {
  await page.goto('./filters')

  const filter = page.getByTestId('filter-default')

  const more = filter.getByTestId('more')
  await expect(more).toBeVisible()
  await more.click()
  await expect(filter.getByTestId('more-floating')).toBeVisible()

  await filter.getByTestId('available-filter-name').click()
  const name = filter.getByTestId('filter-name')
  await expect(name).toBeVisible()

  // write stuff
  await name.click()
  await filter.getByTestId('textinput-name-input').fill('MyTextHere')
  await filter.getByRole('button', { name: /apply/i }).click()
  await expect(page.getByTestId('active-item-floating')).not.toBeVisible()
  const q = { name: { includes: 'MyTextHere' } }
  await expect(page.getByTestId('filter-query')).toHaveText(JSON.stringify(q, null, 2))

  // now dismiss it
  await name.click()
  await filter.locator('button[title="Remove"]').click()
  await expect(filter.getByTestId('active-item-name')).toHaveCount(0)
  await expect(page.getByTestId('filter-query')).toHaveText('{}')
})

test('Testing string, includes', async ({ page }) => {
  await page.goto('./filters')

  const filter = page.getByTestId('filter-default')

  await filter.getByTestId('more').click()
  await filter.getByTestId('available-filter-name').click()

  const name = filter.getByTestId('filter-name')
  await expect(name).toBeVisible()

  // should set text in filter
  await name.click()
  await expect(filter.getByTestId('select-op')).toHaveText('contains substring')
  await filter.getByTestId('textinput-name-input').fill('MyTextHere')
  await filter.getByRole('button', { name: /apply/i }).click()
  await expect(filter.getByTestId('active-item-floating')).not.toBeVisible()

  await expect(filter.getByTestId('filter-display')).toHaveText(' MyTextHere')

  const qWithText = { name: { includes: 'MyTextHere' } }
  await expect(page.getByTestId('filter-query')).toHaveText(JSON.stringify(qWithText, null, 2))

  // should clear text
  await name.click()
  await expect(filter.getByTestId('select-op')).toHaveText('contains substring')
  await filter.getByTestId('textinput-name-input').fill('')
  await filter.getByRole('button', { name: /apply/i }).click()

  await expect(filter.getByTestId('filter-display')).toHaveText('')

  const q = { name: { includes: '' } }
  await expect(page.getByTestId('filter-query')).toHaveText(JSON.stringify(q, null, 2))
})

test('Testing money, gt', async ({ page }) => {
  await page.goto('./filters')

  const filter = page.getByTestId('filter-default')

  await filter.getByTestId('more').click()
  await filter.getByTestId('available-filter-price').click()

  const price = filter.getByTestId('filter-price')
  await price.click()
  await filter.getByTestId('money-input').fill('100.50')
  await filter.getByRole('button', { name: /apply/i }).click()

  await expect(filter.getByTestId('filter-display')).toHaveText('> 100,50 $')

  const q = { price: { gt: 10050 } }
  await expect(page.getByTestId('filter-query')).toHaveText(JSON.stringify(q, null, 2))
})

test('Testing money, lt', async ({ page }) => {
  await page.goto('./filters')

  const filter = page.getByTestId('filter-default')

  await filter.getByTestId('more').click()
  await filter.getByTestId('available-filter-price').click()

  const price = filter.getByTestId('filter-price')
  await price.click()
  await page.getByTestId('select-op').selectOption('lt')
  await filter.getByTestId('money-input').fill('100.50')
  await filter.getByRole('button', { name: /apply/i }).click()

  await expect(filter.getByTestId('filter-display')).toHaveText('< 100,50 $')

  const q = { price: { lt: 10050 } }
  await expect(page.getByTestId('filter-query')).toHaveText(JSON.stringify(q, null, 2))
})

test('Test money, between', async ({ page }) => {
  await page.goto('./filters')

  const filter = page.getByTestId('filter-default')

  await filter.getByTestId('more').click()
  await filter.getByTestId('available-filter-price').click()

  const price = filter.getByTestId('filter-price')
  await price.click()
  await filter.getByTestId('select-op').selectOption('between')
  await filter.getByTestId('money-from-input').fill('102.50')
  await filter.getByTestId('money-to-input').fill('1600.90')
  await filter.getByRole('button', { name: /apply/i }).click()

  await expect(filter.getByTestId('filter-display')).toHaveText(' 102,50 $ - 1.600,90 $')

  const q = { price: { between: [ 10250, 160090 ] } }
  await expect(page.getByTestId('filter-query')).toHaveText(JSON.stringify(q, null, 2))
})

test('Test enum, in', async ({ page }) => {
  await page.goto('./filters')

  const filter = page.getByTestId('filter-default')

  await filter.getByTestId('more').click()
  await filter.getByTestId('available-filter-status').click()

  const status = filter.getByTestId('filter-status')
  await status.click()
  await filter.getByTestId('select-op').selectOption('in')

  await filter.getByTestId('select-status').selectOption('preparing')
  await filter.getByTestId('select-status').selectOption('ready')

  await filter.getByRole('button', { name: /apply/i }).click()

  await expect(filter.getByTestId('filter-display')).toHaveText(' preparing, ready')

  const q = { status: { in: ['preparing', 'ready'] } }
  await expect(page.getByTestId('filter-query')).toHaveText(JSON.stringify(q, null, 2))
})

test('value exists', async ({ page }) => {
  await page.goto('./filters')

  const filter = page.getByTestId('filter-default')

  await filter.getByTestId('more').click()
  await filter.getByTestId('available-filter-cost').click()

  await filter.getByTestId('filter-cost').click()
  await filter.getByTestId('select-op').selectOption('has')

  await filter.getByRole('button', { name: /apply/i }).click()

  await expect(filter.getByTestId('filter-display')).toHaveText('exists')

  const q = { cost: { has: true } }
  await expect(page.getByTestId('filter-query')).toHaveText(JSON.stringify(q, null, 2))
})

test('Date between without any other operation', async ({ page }) => {
  const fakeNow = new Date('January 14 2024 13:37:11').valueOf()

  await page.addInitScript(`{
    Date = class extends Date {
      constructor(...args) {
        if (args.length === 0) {
          super(${fakeNow});
        } else {
          super(...args);
        }
      }
    }
    // Override Date.now() to start from fakeNow
    const __DateNowOffset = ${fakeNow} - Date.now();
    const __DateNow = Date.now;
    Date.now = () => __DateNow() + __DateNowOffset;
  }`)

  //
  await page.goto('./filters')

  const filter = page.getByTestId('filter-between-only')

  await filter.getByTestId('more').click()
  await filter.getByTestId('available-filter-created').click()

  await filter.getByTestId('filter-created').click()

  const fromRoot = filter.getByTestId('dateinput-created-from')
  await fromRoot.locator('a > svg').click()

  await page.locator('.rdp-button.rdp-day').first().click()

  const toRoot = filter.getByTestId('dateinput-created-to')
  await toRoot.locator('a > svg').click()

  await page.locator('.rdp-button.rdp-day').last().click()

  await filter.getByRole('button', { name: /apply/i }).click()

  await expect(filter.getByTestId('filter-display')).toHaveText(' 01/01/2024 - 31/01/2024')
})
