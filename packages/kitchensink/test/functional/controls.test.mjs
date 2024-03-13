import { test, expect } from '@playwright/test'

test.describe('Controls', () => {

  test.describe('Switch', () => {

    test('Testing switch off', async ({ page }) => {
      await page.goto('./controls')

      expect(await page.getByTestId('switch-a').screenshot()).toMatchSnapshot('switch-a--off.png')
    })

    test('Testing switch on', async ({ page }) => {
      await page.goto('./controls')

      await page
        .getByTestId('switch-a')
        .locator('label')
        .click()

      await page.waitForTimeout(500)

      expect(await page.getByTestId('switch-a').screenshot()).toMatchSnapshot('switch-a--on.png')
    })
  })

  test.describe('Tags', () => {
    test('Testing tags', async ({ page }) => {
      await page.goto('./controls')

      expect(await page.getByTestId('tags-tag-a').screenshot()).toMatchSnapshot('tags-no-tags.png')
    })

    test('Testing tags with default values', async ({ page }) => {
      await page.goto('./controls')

      expect(await page.getByTestId('tags-tag-b').screenshot()).toMatchSnapshot('tags-with-default.png')
    })

    test('Testing tags add a tag', async ({ page }) => {
      await page.goto('./controls')

      await page.getByTestId('tags-tag-a').getByRole('textbox').fill('my-tag')
      await page.keyboard.down('Enter')

      expect(await page.getByTestId('tags-tag-a').screenshot()).toMatchSnapshot('tags-with-one-tag.png')
    })

    test('Testing tags remove a tag', async ({ page }) => {
      await page.goto('./controls')

      await page.getByText('foo').locator('span').click()

      expect(await page.getByTestId('tags-tag-b').screenshot()).toMatchSnapshot('tags-with-removed-tag.png')
    })
  })

  test.describe('DateInput', () => {

    test('Test default date input', async ({ page }) => {
      await page.goto('./controls')

      const d = page.locator('input[name="date1"]')

      await d.pressSequentially('25121980')
      await d.press('Tab')

      expect(await d.inputValue()).toBe('25/12/1980')
      expect(await d.screenshot()).toMatchSnapshot('date-input.png')
    })

    test('Test behaviour when not complete', async ({ page }) => {
      await page.goto('./controls')

      const d = page.locator('input[name="date1"]')

      await d.pressSequentially('2512198')
      await d.press('Tab')

      expect(await d.inputValue()).toBe('')
      expect(await d.screenshot()).toMatchSnapshot('date-input-empty.png')
    })

    test('Test behaviour when not complete and with default value', async ({ page }) => {
      await page.goto('./controls')

      const d = page.locator('input[name="date2"]')

      await d.press('End')
      await d.press('Backspace')
      await d.press('Backspace')
      await d.press('Backspace')

      expect(await d.inputValue()).toBe('08/05/2')

      await d.press('Tab')

      expect(await d.inputValue()).toBe('08/05/2023')
    })

    test('Test month first (American style)', async ({ page }) => {
      await page.goto('./controls')

      const d = page.locator('input[name="date3"]')

      await d.pressSequentially('12311980')
      await d.press('Tab')

      expect(await d.inputValue()).toBe('12/31/1980')
    })

    test('Should have unix time onChange', async ({ page }) => {
      await page.goto('./controls')

      const d = page.locator('input[name="date3"]')

      await d.pressSequentially('12311981')
      await d.press('Tab')

      expect(await page.getByTestId('date-tz-monthfirst-unix').innerText()).toBe('378565200000')
    })

    test('When invalid date', async ({ page }) => {
      await page.goto('./controls')

      const d = page.locator('input[name="date1"]')

      await d.pressSequentially('13311981')

      expect(await d.screenshot()).toMatchSnapshot('date-input-invalid.png')
    })

    test('Should have focus', async ({ page }) => {
      await page.goto('./controls')

      const d = page.locator('input[name="date1"]')

      await d.focus()

      expect(await d.screenshot()).toMatchSnapshot('date-input-focused.png')
    })

    test('Show popup', async ({ page }) => {
      await page.goto('./controls')

      await page.getByTestId('dateinput-date3').locator('svg').click()

      expect(await page.getByTestId('dateinput-date3').screenshot()).toMatchSnapshot('date-input-popup-empty.png')
    })

    test('Use calendar to choose date', async ({ page }) => {
      await page.goto('./controls')

      await page.getByTestId('dateinput-date2').locator('svg').click()

      await page.locator('.rdp-row > .rdp-cell > button[name="day"]').first().click()

      expect(await page.locator('input[name="date2"]').inputValue()).toBe('01/05/2023')

      expect(await page.getByTestId('dateinput-date2').screenshot()).toMatchSnapshot('date-input-pick-day-from-popup.png')
    })
  })

  // Money
  test.describe('Money', () => {

    test('Empty input', async ({ page }) => {
      await page.goto('./controls')

      const d = page.getByTestId('money1-input')
      d.scrollIntoViewIfNeeded()

      expect(await d.inputValue()).toBe('0.00')
      expect(await d.screenshot()).toMatchSnapshot('money-empty-defaults.png')
    })

    test('Enter price', async ({ page }) => {
      await page.goto('./controls')

      const d = page.getByTestId('money1-input')
      await d.scrollIntoViewIfNeeded()
      await d.pressSequentially('123456.98')

      expect(await d.inputValue()).toBe('123,456.98')
      expect(await page.getByTestId('money1-group').screenshot()).toMatchSnapshot('money-defaults.png')
    })

    test('Change price', async ({ page }) => {
      await page.goto('./controls')

      const input = page.getByTestId('money2-input')
      await input.scrollIntoViewIfNeeded()
      await input.pressSequentially('34456.23')

      expect(await input.inputValue()).toBe('34,456.23')
      expect(await page.getByTestId('money2-group').screenshot()).toMatchSnapshot('money-defaults-change-value.png')
    })

    test('Change price manually', async ({ page }) => {
      await page.goto('./controls')

      const money = page.getByTestId('money3')
      await money.scrollIntoViewIfNeeded()

      await money.locator('button').click()
      expect(await page.getByTestId('money3-input').inputValue()).toBe('123,456.01')
    })
  })

  test.describe('MoneyTax', () => {

    test('Shoule show zeros when empty', async ({ page }) => {
      await page.goto('./controls')

      const el = page.getByTestId('money-tax-money-input')
      await el.scrollIntoViewIfNeeded()

      expect(await el.inputValue()).toBe('0.00')
    })

    test('Should show the options to add tax', async ({ page }) => {
      await page.goto('./controls')

      const addTax = page.getByTestId('money-tax-add')
      await addTax.scrollIntoViewIfNeeded()

      await expect(addTax).toBeVisible()
    })

    test('Should change price', async ({ page }) => {
      await page.goto('./controls')

      const el = page.getByTestId('money-tax-money-input')

      await el.fill('100.99')
      expect(await el.inputValue()).toBe('100.99')
    })

    test('Should add tax', async ({ page }) => {
      await page.goto('./controls')

      await page.getByTestId('money-tax-add').click()

      const taxGroup = page.getByTestId('money-tax-tax-group')
      await expect(taxGroup).toBeVisible()

      const taxValue = taxGroup.locator('input[name="tax-value"]')
      await taxValue.fill('13.10')

      const taxName = taxGroup.locator('input[name="tax-name"]')
      await taxName.fill('HST')

      await taxGroup.getByTestId('money-tax-tax-add').click()

      await expect(page.getByTestId('money-tax-tax-display-0')).toHaveText('+HST')
    })

    test('Should add a second tax', async ({ page }) => {
      await page.goto('./controls')

      await page.getByTestId('money-tax-add').click()

      const taxGroup = page.getByTestId('money-tax-tax-group')
      await expect(taxGroup).toBeVisible()
      const taxValue = taxGroup.locator('input[name="tax-value"]')
      await taxValue.fill('13.10')
      const taxName = taxGroup.locator('input[name="tax-name"]')
      await taxName.fill('HST')
      await taxGroup.getByTestId('money-tax-tax-add').click()

      await page.getByTestId('money-tax-add').click()

      await expect(taxGroup).toBeVisible()
      await taxValue.fill('5.22')
      await taxName.fill('GST')
      await taxGroup.getByTestId('money-tax-tax-add').click()

      await expect(page.getByTestId('money-tax-tax-display-0')).toHaveText('+HST')
      await expect(page.getByTestId('money-tax-tax-display-1')).toHaveText('+GST')
    })

    test('Should remove tax (by clicking it)', async ({ page }) => {
      await page.goto('./controls')

      await page.getByTestId('money-tax-add').click()

      const taxGroup = page.getByTestId('money-tax-tax-group')
      await expect(taxGroup).toBeVisible()
      const taxValue = taxGroup.locator('input[name="tax-value"]')
      await taxValue.fill('13.10')
      const taxName = taxGroup.locator('input[name="tax-name"]')
      await taxName.fill('HST')
      await taxGroup.getByTestId('money-tax-tax-add').click()

      await expect(page.getByTestId('money-tax-tax-remove-0')).not.toBeVisible()

      await page.getByTestId('money-tax-tax-display-0').hover()

      await expect(page.getByTestId('money-tax-tax-remove-0')).toBeVisible()

      await page.getByTestId('money-tax-tax-remove-0').click()

      await expect(page.getByTestId('dmoney-tax-tax-display-0')).not.toBeAttached()
    })
  })

  // Number
  test.describe('Number', () => {

    test('Show nothing when value is undefined', async ({ page }) => {
      await page.goto('./controls')

      const el = page.getByTestId('number-number1-input')
      await el.scrollIntoViewIfNeeded()

      expect(await el.inputValue()).toBe('')
      expect(await el.screenshot()).toMatchSnapshot('number-defaults-empty.png')
    })

    test('Enter a number', async ({ page }) => {
      await page.goto('./controls')

      const el = page.getByTestId('number-number1-input')

      await el.scrollIntoViewIfNeeded()

      await el.pressSequentially('123456')

      expect(await el.inputValue()).toBe('123456')
      expect(await el.screenshot()).toMatchSnapshot('number-set-positive-number.png')
    })

    test('Enter a negative number', async ({ page }) => {
      await page.goto('./controls')

      const el = page.getByTestId('number-number1-input')

      await el.scrollIntoViewIfNeeded()

      await el.pressSequentially('-123456')
      expect(await el.inputValue()).toBe('-123456')
      expect(await el.screenshot()).toMatchSnapshot('number-set-negative-number.png')
    })

    test('Should accept only positive numbers', async ({ page }) => {
      await page.goto('./controls')

      const el = page.getByTestId('number-number2-input')

      await el.scrollIntoViewIfNeeded()

      await el.pressSequentially('-123423')
      expect(await el.inputValue()).toBe('123423')
      expect(await el.screenshot()).toMatchSnapshot('number-min-zero.png')
    })

    test('Should properly handle minus', async ({ page }) => {
      await page.goto('./controls')

      // const el = page.getByLabel('Default negative value')
      const el = page.getByTestId('number-number3-input')
      await el.scrollIntoViewIfNeeded()
      await el.focus()
      await page.keyboard.down('Home')
      await el.pressSequentially('1')
      expect(await el.inputValue()).toBe('-158967')
    })

    test('Should properly edit number', async ({ page }) => {
      await page.goto('./controls')

      // const el = page.getByLabel('Default negative value')
      const el = page.getByTestId('number-number4-input')
      await el.scrollIntoViewIfNeeded()
      await el.focus()
      await page.keyboard.down('Home')
      await el.pressSequentially('1')
      expect(await el.inputValue()).toBe('178231')
    })

    test('Should change value programatically', async ({ page }) => {
      await page.goto('./controls')

      const el = page.getByTestId('number-number5-input')
      await el.scrollIntoViewIfNeeded()
      await el.pressSequentially('12345')
      expect(await el.inputValue()).toBe('12345')

      await page.getByText('Change to 6578891').click()

      expect(await el.inputValue()).toBe('6578891')
    })

    test('Should clear field', async ({ page }) => {
      await page.goto('./controls')

      const el = page.getByTestId('number-number5-input')
      await el.scrollIntoViewIfNeeded()
      await page.getByText('Change to 6578891').click()

      expect(await el.inputValue()).toBe('6578891')
      await el.clear()
      expect(await el.inputValue()).toBe('')
    })

    test('Should enforce min', async ({ page }) => {
      await page.goto('./controls')

      const el = page.getByTestId('number-number6-input')
      await el.scrollIntoViewIfNeeded()
      await el.pressSequentially('99')

      await page.keyboard.down('Tab')
      await expect(page.getByTestId('number-number6-error')).toBeVisible()
      await expect(page.getByTestId('number-number6-error')).toContainText('Invalid input')

      await page.keyboard.down('Tab')

      expect(await el.inputValue()).toBe('')
    })

    test('Should enforce max', async ({ page }) => {
      await page.goto('./controls')

      const el = page.getByTestId('number-number6-input')
      await el.scrollIntoViewIfNeeded()
      await el.pressSequentially('5001')

      await page.keyboard.down('Tab')
      await expect(page.getByTestId('number-number6-error')).toBeVisible()
      await expect(page.getByTestId('number-number6-error')).toContainText('Invalid input')

      await page.keyboard.down('Tab')

      expect(await el.inputValue()).toBe('')
    })

    test('Should use last valid value on invalid input', async ({ page }) => {
      await page.goto('./controls')

      const el = page.getByTestId('number-number6-input')
      await el.scrollIntoViewIfNeeded()
      await el.pressSequentially('3400')

      await page.keyboard.down('Tab')

      expect(await el.inputValue()).toBe('3400')

      await el.pressSequentially('40000')
      await page.keyboard.down('Tab')
      const err = page.getByTestId('number-number6-error')
      await expect(el).toBeFocused()
      await expect(err).toBeVisible()
      await expect(err).toContainText('Invalid input')

      await page.keyboard.down('Tab')

      expect(await el.inputValue()).toBe('3400')
      await expect(err).not.toBeVisible()
    })

    test('Should show number in center', async ({ page }) => {
      await page.goto('./controls')

      const el = page.getByTestId('number-number7-input')
      await el.scrollIntoViewIfNeeded()

      expect(await el.inputValue()).toBe('5666')

      expect(await el.screenshot()).toMatchSnapshot('number-center.png')
    })
  })

  // Text
  test.describe('Text', () => {
    test('Show nothing when value is undefined', async ({ page }) => {
      await page.goto('./controls')

      const el = page.getByTestId('textinput-text1-input')
      await el.scrollIntoViewIfNeeded()

      expect(await el.inputValue()).toBe('')
      expect(await el.screenshot()).toMatchSnapshot('textinput-defaults-empty.png')
    })

    test('Enter some text', async ({ page }) => {
      await page.goto('./controls')

      const el = page.getByTestId('textinput-text1-input')

      await el.scrollIntoViewIfNeeded()

      await el.pressSequentially('My name is Artyom')

      expect(await el.inputValue()).toBe('My name is Artyom')
      expect(await el.screenshot()).toMatchSnapshot('text-set-some-text.png')
    })

    test('Restrict length of entered text', async ({ page }) => {
      await page.goto('./controls')

      const el = page.getByTestId('textinput-text2-input')

      await el.scrollIntoViewIfNeeded()

      await expect(page.getByTestId('textinput-text2-info')).toContainText('0/20')

      await el.pressSequentially('My name is Artyom and I head to Kitai Gorod')

      expect(await el.inputValue()).toBe('My name is Artyom an')
      await expect(page.getByTestId('textinput-text2-info')).toContainText('20/20')
    })

    test('Should show state\'s text event if exeeds limit', async ({ page }) => {
      await page.goto('./controls')

      const el = page.getByTestId('textinput-text4-input')

      await el.scrollIntoViewIfNeeded()

      await expect(page.getByTestId('textinput-text4-info')).toContainText('85/80')
      expect(await el.inputValue()).toBe('As he crossed toward the pharmacy at the corner he involuntarily turned his head jump')

      await el.focus()

      await page.keyboard.down('End')
      await page.keyboard.down('Backspace')
      await page.keyboard.down('Backspace')
      await page.keyboard.down('Backspace')
      await page.keyboard.down('Backspace')
      await page.keyboard.down('Backspace')

      await expect(page.getByTestId('textinput-text4-info')).toContainText('80/80')

      await page.keyboard.down('2')

      await expect(page.getByTestId('textinput-text4-info')).toContainText('80/80')

      await expect(page.getByTestId('txt4')).toContainText('As he crossed toward the pharmacy at the corner he involuntarily turned his head')
    })

    test('Should show error from properties', async ({ page }) => {
      await page.goto('./controls')

      await page.getByTestId('textinput-text5-root').scrollIntoViewIfNeeded()
      await expect(page.getByTestId('textinput-text5-error')).toContainText('Invalid Input')
    })

    test('Should be disabled', async ({ page }) => {
      await page.goto('./controls')

      const input = page.getByTestId('textinput-textDisabled-input')
      await input.scrollIntoViewIfNeeded()

      await expect(input).toBeDisabled()
    })
  })

  test.describe('Entity', () => {

    test('Entity search should be empty', async ({ page }) => {
      await page.goto('./controls#entity')

      const el = page.getByTestId('entity-search')
      await el.scrollIntoViewIfNeeded()

      const searchInput = el.locator('div > input')
      expect(await searchInput.inputValue()).toBe('')

      await expect(el.getByTestId('data-list')).not.toBeAttached()
      await expect(el.getByTestId('busy')).not.toBeVisible()
    })

    test('Entity search should show popup while searching', async ({ page }) => {
      await page.goto('./controls')

      const el = page.getByTestId('entity-search')
      await el.scrollIntoViewIfNeeded()

      const searchInput = el.locator('div > input')
      await searchInput.fill('12')
      const popup = el.getByTestId('data-list')
      await popup.waitFor()

      await expect(popup).toBeVisible()
    })

    test('Entity search should hide popup when there\'s no search text', async ({ page }) => {
      await page.goto('./controls')

      const el = page.getByTestId('entity-search-default')
      await el.scrollIntoViewIfNeeded()

      const searchInput = el.locator('div > input')
      const popup = el.getByTestId('data-list')

      await searchInput.fill('12')
      await expect(popup).toBeVisible()
      await searchInput.clear()
      await expect(popup).not.toBeVisible()
    })

    test('Force busy on entity search', async ({ page }) => {
      await page.goto('./controls')

      const el = page.getByTestId('entity-search-busy')
      const searchInput = el.locator('div > input')

      await expect(searchInput).toBeDisabled()
      await expect(el.getByTestId('entity-search-busy-busy')).toBeVisible()
    })

    test('Should not show popup', async ({ page }) => {
      await page.goto('./controls#entity')

      const el = page.getByTestId('entity-nodefault')
      await el.scrollIntoViewIfNeeded()

      const searchInput = el.locator('div > input')
      expect(await searchInput.inputValue()).toBe('')

      await expect(el.getByTestId('data-list')).not.toBeAttached()
    })

    test('Should show popup while searching', async ({ page }) => {
      await page.goto('./controls')

      const el = page.getByTestId('entity-nodefault')
      await el.scrollIntoViewIfNeeded()

      const searchInput = el.locator('div > input')
      await searchInput.fill('12')
      const popup = el.getByTestId('data-list')
      await popup.waitFor()

      await expect(popup).toBeVisible()
    })

    test('Should hide popup when there\'s no search text', async ({ page }) => {
      await page.goto('./controls')

      const el = page.getByTestId('entity-nodefault')
      await el.scrollIntoViewIfNeeded()

      const searchInput = el.locator('div > input')
      const popup = el.getByTestId('data-list')

      await searchInput.fill('12')
      await expect(popup).toBeVisible()
      await searchInput.clear()
      await expect(popup).not.toBeVisible()
    })

    test('Should select item when navigating to the list and clicking enter', async ({ page }) => {
      await page.goto('./controls')

      const el = page.getByTestId('entity-nodefault')
      await el.scrollIntoViewIfNeeded()

      const searchInput = el.locator('div > input')

      await searchInput.fill('12')
      const popup = el.getByTestId('data-list')
      await popup.waitFor()
      await page.keyboard.down('ArrowDown')
      await page.keyboard.down('Enter')

      await expect(searchInput).not.toBeAttached()

      const display = el.locator('span')
      await expect(display).toBeAttached()
    })

    test('Should clear entity', async ({ page}) => {
      await page.goto('./controls')

      const el = page.getByTestId('entity-nodefault')
      await el.scrollIntoViewIfNeeded()

      const searchInput = el.locator('div > input')

      await searchInput.fill('12')
      const popup = el.getByTestId('data-list')
      await popup.waitFor()
      await page.keyboard.down('ArrowDown')
      await page.keyboard.down('Enter')

      const display = el.getByTestId('entity-display')
      await expect(display).toBeVisible()
      await expect(searchInput).not.toBeAttached()

      const clearEl = el.getByTestId('clear-link')
      await clearEl.click()

      await expect(display).not.toBeAttached()
      await expect(searchInput).toBeVisible()
    })

    test('Should show predefined value', async ({page}) => {
      await page.goto('./controls')

      const el = page.getByTestId('entity-withdefault')
      await el.scrollIntoViewIfNeeded()

      const searchInput = el.locator('div > input')
      await expect(searchInput).not.toBeAttached()
      const display = el.getByTestId('entity-display')
      await expect(display).toBeVisible()
    })

    test('Should clear predefined value', async ({page}) => {
      await page.goto('./controls')

      const el = page.getByTestId('entity-withdefault')
      await el.scrollIntoViewIfNeeded()

      const clearEl = el.getByTestId('clear-link')
      await clearEl.click()

      const searchInput = el.locator('div > input')
      await expect(searchInput).toBeVisible()

      const display = el.getByTestId('entity-display')
      await expect(display).not.toBeAttached()
    })

    test('Searching with no results', async ({page}) => {
      await page.goto('./controls')

      const el = page.getByTestId('entity-nodefault')
      await el.scrollIntoViewIfNeeded()

      const searchInput = el.locator('div > input')
      await searchInput.fill('no')

      const results = el.getByTestId('data-list')
      await results.waitFor()
      await expect(results).toHaveText('No Results')
    })

    test('Initial results', async ({ page }) => {
      await page.goto('./controls')

      const el = page.getByTestId('entity-init')
      await el.scrollIntoViewIfNeeded()

      const searchInput = el.locator('div > input')
      await searchInput.focus()
      await el.getByTestId('busy').waitFor({state: 'hidden'})

      const results = el.getByTestId('data-list')

      await expect(results).toBeVisible()
      await expect(results.getByTestId('entity-list-item')).toHaveCount(2)
      await expect(results.getByTestId('entity-list-item')).toHaveText(['Recommended 1', 'Recommended 2'])
    })

    test('Should not clear when readonly', async ({ page }) => {
      await page.goto('./controls')

      const el = page.getByTestId('entity-ro')
      await el.scrollIntoViewIfNeeded()

      const display = el.getByTestId('entity-display')
      await expect(display).toBeVisible

      const clearEl = el.getByTestId('clear-link')
      await expect(clearEl).not.toBeAttached()
    })
  })

  test.describe('Tax', () => {
    test('Should show 0.00 when no tax defined', async ({ page }) => {
      await page.goto('./controls')

      const el = page.getByTestId('tax1')
      await el.scrollIntoViewIfNeeded()

      const taxInput = el.locator('[name="tax1-value"]')

      await expect(taxInput).toHaveValue('0.00')
    })

    test('Should add tax', async ({ page }) => {
      await page.goto('./controls')

      const el = page.getByTestId('tax1')
      await el.scrollIntoViewIfNeeded()

      const taxInput = el.locator('[name="tax1-value"]')
      await taxInput.fill('1350')

      const nameInput = el.locator('[name="tax1-name"]')
      await nameInput.fill('VAT')

      const out = page.getByTestId('tax1-out')
      await expect(out).toHaveText('13.50% VAT')
    })

    test('Should show default value', async ({ page }) => {
      await page.goto('./controls')

      const el = page.getByTestId('tax2')
      await el.scrollIntoViewIfNeeded()

      const taxInput = el.locator('[name="tax2-value"]')
      const nameInput = el.locator('[name="tax2-name"]')
      const out = page.getByTestId('tax2-out')

      await expect(taxInput).toHaveValue('45.15')
      await expect(nameInput).toHaveValue('GTX')
      await expect(out).toHaveText('45.15% GTX')
    })

    test('Should change to different value', async ({ page }) => {
      await page.goto('./controls')

      const el = page.getByTestId('tax2')
      await el.scrollIntoViewIfNeeded()

      const taxInput = el.locator('[name="tax2-value"]')
      const nameInput = el.locator('[name="tax2-name"]')
      const out = page.getByTestId('tax2-out')

      await taxInput.focus()
      await taxInput.press('Home')
      await taxInput.pressSequentially('1315', { delay: 100 })

      await nameInput.fill('GST')

      await expect(taxInput).toHaveValue('13.15')
      await expect(nameInput).toHaveValue('GST')
      await expect(out).toHaveText('13.15% GST')
    })
  })

  test.describe('Percent', () => {
    test('should show 0.00 with no value', async ({ page }) => {
      await page.goto('./controls')

      const el = page.getByTestId('test-percent')
      await el.scrollIntoViewIfNeeded()

      await expect(el.locator('input')).toHaveValue('0.00')
    })

    // TODO: need to fix this. We are ok how it works
    // test('should clear when hitting delete', async ({ page }) => {
    //   await page.goto('./controls')

    //   const el = page.getByTestId('test-percent')
    //   await el.scrollIntoViewIfNeeded()

    //   const input = el.locator('input')

    //   await input.focus()

    //   await input.pressSequentially('123', { delay: 100 })

    //   await input.press('Home')

    //   await input.pressSequentially('DelDelDelDelDelDelDelDelDel', { delay: 100 })

    //   await expect(el.locator('input')).toHaveValue('0.00')
    // })
  })

  test.describe('MultiSelect', () => {
    test('Testing multi-select', async ({ page }) => {
      await page.goto('./controls')

      expect(await page.getByTestId('select-mselect1').screenshot()).toMatchSnapshot('mselect-no-selected.png')
    })

    test('Testing multi-select with selected options', async ({ page }) => {
      await page.goto('./controls')

      expect(await page.getByTestId('select-mselect2').screenshot()).toMatchSnapshot('mselect-with-selected.png')
    })

    test('Testing multi-select select one options', async ({ page }) => {
      await page.goto('./controls')

      await page.getByTestId('select-mselect1').selectOption('two')

      expect(await page.getByTestId('select-mselect1').screenshot()).toMatchSnapshot('mselect-with-one-selected.png')
    })

    test('Testing remove an options', async ({ page }) => {
      await page.goto('./controls')

      await page.getByText('two').locator('span').click()

      expect(await page.getByTestId('select-mselect2').screenshot()).toMatchSnapshot('mselect-with-one-removed.png')
    })
  })

  // Text Area
  test.describe('Text Area', () => {
    test('Show nothing when value is undefined', async ({ page }) => {
      await page.goto('./controls')

      const el = page.getByTestId('textarea-mtext')
      await el.scrollIntoViewIfNeeded()

      expect(await el.inputValue()).toBe('')
      expect(await el.screenshot()).toMatchSnapshot('textarea-defaults-empty.png')
    })

    test('Enter some text', async ({ page }) => {
      await page.goto('./controls')

      const el = page.getByTestId('textarea-mtext')

      await el.scrollIntoViewIfNeeded()

      await el.pressSequentially('My name is Artyom')

      expect(await el.inputValue()).toBe('My name is Artyom')
      expect(await el.screenshot()).toMatchSnapshot('textarea-set-some-text.png')
    })

    test('Restrict length of entered text', async ({ page }) => {
      await page.goto('./controls')

      const el = page.getByTestId('textarea-mtext2')

      await el.scrollIntoViewIfNeeded()

      await expect(page.getByTestId('textarea-mtext2-info')).toContainText('0/200')

      let text = ''
      for(let i = 0; i < 20; i++) {
        text += '0123456789'
        await el.pressSequentially('0123456789')
      }

      await el.pressSequentially('0123456789')

      expect(await el.inputValue()).toBe(text)
      await expect(page.getByTestId('textarea-mtext2-info')).toContainText('200/200')
    })

    test('Should show error from properties', async ({ page }) => {
      await page.goto('./controls')

      await page.getByTestId('textarea-mtext3-root').scrollIntoViewIfNeeded()
      await expect(page.getByTestId('textarea-mtext3-error')).toContainText('Invalid Input')
    })
  })

  // Valid Input
  test.describe('Valid Input', () => {
    test('Should show accept, disabled', async ({ page }) => {
      await page.goto('./controls')

      const root = await page.getByTestId('v1-root')

      await expect(root.getByTestId('v1-accept')).toBeDisabled()
    })

    test('Accept disabled after removing value', async ({ page }) => {
      await page.goto('./controls')

      const root = await page.getByTestId('v1-root')
      const input = await root.getByTestId('v1-input')

      await input.fill('12345678')
      await root.getByTestId('v1-accept').click()

      await root.getByTestId('v1-remove').click()
      await expect(root.getByTestId('v1-accept')).toBeDisabled()
    })

    test('Invalid input', async ({ page }) => {
      await page.goto('./controls')

      const root = page.getByTestId('v1-root')
      const input = root.getByTestId('v1-input')

      await root.scrollIntoViewIfNeeded()

      await input.fill('fail')
      await expect(root.getByTestId('v1-error')).toContainText('Invalid input...')
      await expect(root.getByTestId('v1-accept')).toBeDisabled()
    })
  })

  // Items
  test.describe('Items', () => {

    test('Should have edit hidden', async ({ page }) => {
      await page.goto('./controls')

      const root = page.getByTestId('order-items')

      await root.scrollIntoViewIfNeeded()

      const rows = await root.locator('button[data-name="edit"]')
      const count = await rows.count()
      for(let i = 0; i < count; i++) {
        const row = rows.nth(i)

        // button should be visible
        await expect(row).toBeVisible()

        // but not the svg
        await expect(row.locator('svg')).toBeHidden()
      }
    })

    test('Should show options to edit on hover', async ({ page }) => {
      await page.goto('./controls')

      const root = page.getByTestId('order-items')

      await root.scrollIntoViewIfNeeded()
      const rows = await root.getByTestId('row')

      const firstRow = await rows.first()

      await firstRow.hover()

      await expect(firstRow.locator('button[data-name="edit"] > svg')).toBeVisible()
    })

    test('should show edit on focus', async ({ page }) => {
      await page.goto('./controls')

      const root = page.getByTestId('order-items')
      await root.scrollIntoViewIfNeeded()
      const rows = await root.getByTestId('row')
      const firstRow = await rows.first()

      await firstRow.locator('button[data-name="edit"]').focus()

      await expect(firstRow.locator('button[data-name="edit"] > svg')).toBeVisible()
    })

    test('should switch to edit', async ({ page }) => {
      await page.goto('./controls')

      const root = page.getByTestId('order-items')
      await root.scrollIntoViewIfNeeded()

      await root.locator('button[data-name="edit"]').first().click()

      const firstRow = await root.getByTestId('row').first()

      await expect(firstRow.getByTestId('entity-control')).toBeVisible()
      await expect(firstRow.getByTestId('entity-control').getByTestId('clear-link')).toBeVisible()
      await expect(firstRow.getByTestId('money-tax-money-group')).toBeVisible()
      await expect(firstRow.getByTestId('money-tax-add')).toBeVisible()
      await expect(firstRow.getByTestId('number-qty-17-input')).toBeVisible()
      await expect(firstRow.getByTestId('money-input')).toBeVisible()

      await expect(firstRow.getByTestId('accept')).toBeVisible()
      await expect(firstRow.getByTestId('cancel')).toBeVisible()
      await expect(firstRow.getByTestId('remove')).toBeVisible()
    })

    test('should be able to cancel', async ({ page }) => {
      await page.goto('./controls')

      const root = page.getByTestId('order-items')
      await root.scrollIntoViewIfNeeded()

      await root.locator('button[data-name="edit"]').first().click()

      const firstRow = await root.getByTestId('row').first()

      // change some fields
      await firstRow.getByTestId('money-tax-money-input').fill('100033')
      await page.keyboard.down('Tab')
      await page.keyboard.down('Enter')
      await firstRow.getByTestId('money-tax-tax').locator('[name="tax-value"]').fill('1300')
      await firstRow.getByTestId('money-tax-tax').locator('[name="tax-name"]').fill('HST')
      await page.keyboard.down('Tab')
      await page.keyboard.down('Enter')
      await firstRow.getByTestId('number-qty-17-input').fill('25')
      await firstRow.getByTestId('money-input').fill('566670')

      await firstRow.getByTestId('cancel').click()

      // should have previous values
      await expect(firstRow.locator('div').nth(0)).toContainText('My Product')
      await expect(firstRow.locator('div').nth(1)).toContainText('$10.99')
      await expect(firstRow.locator('div').nth(2)).toContainText('10ea')
      await expect(firstRow.locator('div').nth(3)).toContainText('$109.90')
    })


    test('should change on accept', async ({ page }) => {
      await page.goto('./controls')

      const root = page.getByTestId('order-items')
      await root.scrollIntoViewIfNeeded()

      await root.locator('button[data-name="edit"]').first().click()

      const firstRow = await root.getByTestId('row').first()

      // change some fields
      await firstRow.getByTestId('money-tax-money-input').fill('100033')
      await page.keyboard.down('Tab')
      await page.keyboard.down('Enter')
      await firstRow.getByTestId('money-tax-tax').locator('[name="tax-value"]').fill('1300')
      await firstRow.getByTestId('money-tax-tax').locator('[name="tax-name"]').fill('HST')
      await page.keyboard.down('Tab')
      await page.keyboard.down('Enter')
      await firstRow.getByTestId('number-qty-17-input').fill('25')
      await firstRow.getByTestId('money-input').focus()
      await firstRow.getByTestId('money-input').fill('566670')

      await firstRow.getByTestId('accept').click()

      // should have previous values
      await expect(firstRow.locator('div').nth(0)).toContainText('My Product')
      await expect(firstRow.locator('div').nth(1)).toContainText('13.00% HST$1,000.33')
      await expect(firstRow.locator('div').nth(2)).toContainText('25ea')
      await expect(firstRow.locator('div').nth(3)).toContainText('$5,666.70')
    })


    test('Should change product', async ({ page }) => {
      await page.goto('./controls')

      const root = page.getByTestId('order-items')
      await root.scrollIntoViewIfNeeded()

      await root.locator('button[data-name="edit"]').nth(1).click()

      const secondRow = await root.getByTestId('row').nth(1)
      await secondRow.getByTestId('entity-control').getByTestId('clear-link').click()

      await secondRow.getByTestId('entity-control-search').locator('input').pressSequentially('Ent')

      await page.getByTestId('entity-list-item').nth(1).click()

      await secondRow.getByTestId('money-tax-money-input').fill('100033')
      await page.keyboard.down('Tab')
      await page.keyboard.down('Enter')
      await secondRow.getByTestId('money-tax-tax').locator('[name="tax-value"]').fill('1300')
      await secondRow.getByTestId('money-tax-tax').locator('[name="tax-name"]').fill('HST')
      await secondRow.getByTestId('money-tax-tax-add').click()
      await secondRow.getByTestId('number-qty-2-input').fill('25')
      await secondRow.getByTestId('money-input').focus()
      await secondRow.getByTestId('money-input').fill('566670')

      await secondRow.getByTestId('accept').click()

      // should have previous values
      await expect(secondRow.locator('div').nth(0)).toContainText('Entity 2')
      await expect(secondRow.locator('div').nth(1)).toContainText('13.00% HST$1,000.33')
      await expect(secondRow.locator('div').nth(2)).toContainText('25')
      await expect(secondRow.locator('div').nth(3)).toContainText('$5,666.70')
    })

    test('Should remove', async ({ page }) => {
      await page.goto('./controls')

      const root = page.getByTestId('order-items')

      await root.scrollIntoViewIfNeeded()

      await root.locator('button[data-name="edit"]').nth(1).click()

      const secondRow = await root.getByTestId('row').nth(1)
      await secondRow.getByTestId('remove').click()

      await expect(await root.getByTestId('row').count()).toBe(1)
    })


    test('Should add new line', async ({ page }) => {
      await page.goto('./controls')

      const root = page.getByTestId('order-items')

      await root.scrollIntoViewIfNeeded()

      await root.getByTestId('add-new').click()

      await root.getByTestId('entity-control-search').locator('input').pressSequentially('Ent')

      await page.getByTestId('entity-list-item').nth(1).click()

      await root.getByTestId('money-tax-money-input').fill('100033')
      await page.keyboard.down('Tab')
      await page.keyboard.down('Enter')
      await root.getByTestId('money-tax-tax').locator('[name="tax-value"]').fill('1300')
      await root.getByTestId('money-tax-tax').locator('[name="tax-name"]').fill('HST')
      await root.getByTestId('money-tax-tax-add').click()
      await root.getByTestId('number-qty-new-input').fill('25')
      await root.getByTestId('money-input').focus()
      await root.getByTestId('money-input').fill('566670')

      await root.getByTestId('accept').click()

      // should have previous values
      const lastRow = await root.getByTestId('row').last()
      await expect(lastRow.locator('div').nth(0)).toContainText('Entity 2')
      await expect(lastRow.locator('div').nth(1)).toContainText('13.00% HST$1,000.33')
      await expect(lastRow.locator('div').nth(2)).toContainText('25')
      await expect(lastRow.locator('div').nth(3)).toContainText('$5,666.70')
    })

  })

  // Items
  test.describe('Radio Buttons', () => {

    test('should have two items', async ({ page }) => {
      await page.goto('./controls')

      const root = page.getByTestId('radio-button')
      await root.scrollIntoViewIfNeeded()

      expect(await root.getByTestId('radio-item').count()).toBe(2)
    })

    test('should show default', async ({ page }) => {
      await page.goto('./controls')

      const root = page.getByTestId('radio-button')
      await root.scrollIntoViewIfNeeded()

      await expect(await root.getByTestId('radio-input').first()).not.toBeChecked()
      await expect(await root.getByTestId('radio-input').nth(1)).toBeChecked()
    })

    test('should select value', async ({ page }) => {
      await page.goto('./controls')

      const root = page.getByTestId('radio-button')
      await root.scrollIntoViewIfNeeded()

      const items = root.getByTestId('radio-item').locator('label')

      await items.first().click()
      await expect(await items.nth(0)).toBeChecked()
      await expect(await items.nth(1)).not.toBeChecked()
    })

    test('should display name', async ({ page }) => {
      await page.goto('./controls')

      const root = page.getByTestId('radio-button')
      await root.scrollIntoViewIfNeeded()

      await expect(root.getByTestId('radio-item').first()).toContainText('Value 1Description of value 1')
    })

  })

})
