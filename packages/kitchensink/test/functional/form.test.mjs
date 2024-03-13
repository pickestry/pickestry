import { test, expect } from '@playwright/test'

test('Clean form', async ({ page }) => {
  await page.goto('./form')

  const form = page.getByTestId('simple-form')

  await form.locator('input[name="name"]').fill('Taylor Swift')
  await form.locator('input[name="nickname"]').fill('swifty')
  await form.locator('input[name="age"]').fill('33')
  await form.getByTestId('switch-field-switch').locator('label').click()
  await form.locator('input[name="birthday"]').fill('13121989')
  await form.locator('input[name="salary"]').fill('100000000')
  await form.getByTestId('select-mood').selectOption('two')

  const tags = form.getByTestId('tags-tags').locator('input[name="tags"]')

  const tagsArr = [
    'one',
    'two',
    'three-four-five',
    'six',
    'seven'
  ]

  for(const tag of tagsArr) {
    await tags.fill(tag)
    await tags.press('Enter')
  }

  await form.locator('input[type="submit"]').click()

  expect(await page.getByTestId('model').screenshot()).toMatchSnapshot('simple-form-model.png')
})

test('Form with entity', async ({ page }) => {
  await page.goto('./form')

  const form = page.getByTestId('with-entity-form')
  expect(await page.getByTestId('model-with-entity').screenshot()).toMatchSnapshot('before-with-entity-form-model.png')

  await form.locator('input[name="name"]').fill('Taylor Swift')
  await form.locator('input[type="submit"]').click()

  expect(await page.getByTestId('model-with-entity').screenshot()).toMatchSnapshot('after-with-entity-form-model.png')
})

test('Switch remains after using', async ({ page }) => {
  await page.goto('./form')

  const form = page.getByTestId('simple-form')
  await form.getByTestId('switch-field-switch').locator('label').click()
  await form.getByTestId('switch-field-switch').locator('label').click()

  await form.locator('input[type="submit"]').click()
  expect(await page.getByTestId('model').screenshot()).toMatchSnapshot('switchfield-flag-remains-in-model.png')
})

test('Use recommended option in entity field', async ({ page }) => {
  await page.goto('./form')

  const form = page.getByTestId('simple-form')

  const customer = form.locator('input[name="customer"]')
  await customer.focus()
  await expect(form.getByTestId('data-list')).toBeVisible()
  await page.getByText('Recommended 2').click()

  await expect(form.getByTestId('entity-display')).toContainText('Recommended 2')

  await form.locator('input[type="submit"]').click()
  expect(await page.getByTestId('model').screenshot()).toMatchSnapshot('entityfield-recommneded_option.png')
})

test('Search and choose an option', async ({ page }) => {
  await page.goto('./form')

  const form = page.getByTestId('simple-form')

  await form.locator('input[name="customer"]').fill('Ent')
  await form.getByText('Entity 2').click()

  await expect(form.getByTestId('entity-display')).toContainText('Entity 2')

  await form.locator('input[type="submit"]').click()
  expect(await page.getByTestId('model').screenshot()).toMatchSnapshot('entityfield-searched_option.png')
})

test('Should have default entity field', async ({ page }) => {
  await page.goto('./form')

  const form = page.getByTestId('with-entity-form')
  await expect(form.getByTestId('patron').getByTestId('entity-display')).toContainText('Entity 2')
  expect(await page.getByTestId('model-with-entity').screenshot()).toMatchSnapshot('before-with-existing-foreign-entity.png')

  await form.getByTestId('clear-link').click()
  expect(await form.locator('input[name="customer"]')).toBeVisible()

  await form.locator('input[type="submit"]').click()

  expect(await page.getByTestId('model-with-entity').screenshot()).toMatchSnapshot('after-with-existing-foreign-entity.png')
})

test('TextField should be disabled', async ({ page }) => {
  await page.goto('./form')

  const form = page.getByTestId('with-entity-form')
  await expect(form.getByTestId('textinput-semiperma-input')).toBeDisabled()
})


test.describe('RadioField', () => {

  test('should update object', async ({ page }) => {
    await page.goto('./form')

    const radio = page.getByTestId('with-entity-form').getByTestId('radio-field')
    await radio.scrollIntoViewIfNeeded()

    const items = radio.getByTestId('radio-input')

    await expect(items.nth(0)).not.toBeChecked()
    await expect(items.nth(1)).toBeChecked()
    await expect(items.nth(2)).not.toBeChecked()

    await radio.getByTestId('radio-item').first().click()

    await expect(await items.nth(0)).toBeChecked()
    await expect(await items.nth(1)).not.toBeChecked()
    await expect(await items.nth(2)).not.toBeChecked()
  })
})

