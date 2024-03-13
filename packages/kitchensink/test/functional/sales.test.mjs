import { test } from '@playwright/test'
import { expect } from '@playwright/test'

test.describe('Discount control', () => {

  test('work with predefined type', async ({ page }) => {
    await page.goto('./sales')

    const root = page.getByTestId('discount')

    await root.getByTestId('textinput-name-input').fill('MYDISC')
    await root.getByLabel('Amount').pressSequentially('255')
    await root.getByLabel('Amount').press('.')
    await root.getByLabel('Amount').pressSequentially('98')

    await root.getByText('Use').click()

    expect(await root.getByTestId('discount-control-out').screenshot()).toMatchSnapshot('discount-control.png')
  })

  test('switch types', async ({ page }) => {
    await page.goto('./sales')

    const root = page.getByTestId('discount')

    await root.getByTestId('radio-item').last().locator('label').click()
    await root.getByTestId('textinput-name-input').fill('MYDISC')
    const value = root.getByTestId('percent').locator('input')
    await value.pressSequentially('10')
    await value.press('.')
    await value.pressSequentially('25')

    await root.getByText('Use').click()

    expect(await root.getByTestId('discount-control-out').screenshot()).toMatchSnapshot('discount-control-switch-types.png')
  })
})

test.describe('Discount form', () => {

  test('adding one discount', async ({ page }) => {
    await page.goto('./sales')

    await page.getByTestId('switch-discount-form').click()

    const addButton = page.getByText('Add Discount')
    await addButton.click()

    const root = page.getByTestId('discount-form')

    await root.getByTestId('radio-item').last().locator('label').click()
    await root.getByTestId('textinput-name-input').fill('MYDISC')
    const value = root.getByTestId('percent').locator('input')
    await value.pressSequentially('10')
    await value.press('.')
    await value.pressSequentially('25', { delay: 100 })

    await root.getByText('Use').click()

    await expect(root).not.toBeAttached()
    await expect(addButton).toBeVisible()

    const lines = page.getByTestId('discount-field-test').getByTestId('lines')

    await expect(lines.first()).toContainText('MYDISC -10.02%✕')
    await expect(lines.first().locator('button')).not.toBeVisible()

    await lines.first().hover()
    await expect(lines.first().locator('button')).toBeVisible()
  })

  test('maximum two discounts', async ({ page }) => {
    await page.goto('./sales')

    await page.getByTestId('switch-discount-form').click()

    const addButton = page.getByText('Add Discount')
    await addButton.click()

    const root = page.getByTestId('discount-form')

    await root.getByTestId('radio-item').last().locator('label').click()
    await root.getByTestId('textinput-name-input').fill('MYDISC')
    const value = root.getByTestId('percent').locator('input')
    await value.pressSequentially('10')
    await value.press('.')
    await value.pressSequentially('25', { delay: 100 })

    await root.getByText('Use').click()

    // second discount
    await addButton.click()

    await root.getByTestId('textinput-name-input').fill('MYDISC')
    await root.getByTestId('money-input').pressSequentially('255')
    await root.getByTestId('money-input').press('.')
    await root.getByTestId('money-input').pressSequentially('98')

    await root.getByText('Use').click()

    await expect(root).not.toBeAttached()
    await expect(addButton).not.toBeVisible()

    const lines = page.getByTestId('discount-field-test').getByTestId('lines')

    await expect(lines.first()).toContainText('MYDISC -10.02%✕')
    await expect(lines.nth(1)).toContainText('MYDISC -$255.98✕')

    await lines.first().focus()
    await expect(lines.first()).toBeVisible()
  })

  test('remove discount by clicking remove', async ({ page }) => {
    await page.goto('./sales')

    await page.getByTestId('switch-discount-form').click()

    const addButton = page.getByText('Add Discount')
    await addButton.click()

    const root = page.getByTestId('discount-form')

    await root.getByTestId('textinput-name-input').fill('MYDISC')
    await root.getByTestId('money-input').pressSequentially('255')
    await root.getByTestId('money-input').press('.')
    await root.getByTestId('money-input').pressSequentially('98')

    await root.getByText('Use').click()

    // now remove it
    const lines = page.getByTestId('discount-field-test').getByTestId('lines')
    await lines.first().hover()
    await lines.first().locator('button').click()
    await expect(await page.getByTestId('discount-field-test').getByTestId('lines').count()).toBe(0)
  })

})
