// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { describe } from 'node:test'
import { it } from 'node:test'
import { beforeEach } from 'node:test'
import { afterEach } from 'node:test'
import assert from 'node:assert/strict'
import { utils } from '../utils.mjs'
import { PDFControl } from './PDFControl.mjs'
import { CommonControl } from './CommonControl.mjs'

describe('PDFControl', () => {

  let control

  beforeEach(async () => { control = await utils.init(CommonControl, PDFControl) })

  afterEach(async () => { await control.__cleanup() })

  it('should export customers', async (context) => {
    await control.persist.createCustomer({
      name: 'Customer 1',
      email: 'customer1@email.com'
    })

    context.mock.timers.enable({ apis: ['Date'], now: 1707776146234 })

    const { content, type, name } = await control.printCollectionPDF({
      model: 'Customer'
    })

    const blob = new Blob([content], { type })

    assert.ok(await utils.checkFile(blob, name, true))
  })
})
