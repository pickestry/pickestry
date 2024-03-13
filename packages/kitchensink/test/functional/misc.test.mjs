import { test, expect } from '@playwright/test'
import { scrollTo } from '../utils.mjs'

test.describe('Misc', () => {

  test('Testing Stacked Props', async ({ page }) => {
    await page.goto('./misc')

    const props = page.getByTestId('stacked-props')

    expect(await props.screenshot()).toMatchSnapshot('stacked-props.png')
  })

  test('Simple list', async ({ page }) => {
    await page.goto('./misc')

    scrollTo(page.getByTestId('simple-list'))

    await expect(page.getByTestId('simple-list-selected')).not.toBeVisible()

    await expect(page.getByTestId('simple-list').getByTestId('line-item')).toHaveCount(4)

    const sndItem = page.getByTestId('simple-list').getByTestId('line-item').nth(1)

    await page.hover('[data-testid="simple-list"] [data-testid="line-item"]:nth-child(1)')

    await sndItem.click()

    await expect(page.getByTestId('simple-list-selected')).toHaveText('Item B')
  })

  test('List with onRemove', async ({ page }) => {
    await page.goto('./misc')

    const list = page.getByTestId('list-remove')

    scrollTo(list)

    await expect(list.getByTestId('line-item')).toHaveCount(10)

    const thirdRow = list.getByTestId('line-item').nth(2)

    await expect(thirdRow).toContainText('14 Andromedae b')

    const removeLink = thirdRow.locator('[data-action="remove"]')

    await expect(removeLink).not.toBeVisible()
    await thirdRow.hover()
    await expect(removeLink).toBeVisible()
    await removeLink.click()

    await expect(list.getByTestId('line-item')).toHaveCount(9)

    await expect(list).not.toContainText('14 Andromedae b')
  })

})
