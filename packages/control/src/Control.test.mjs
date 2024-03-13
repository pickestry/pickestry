// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { describe } from 'node:test'
import { it } from 'node:test'
import assert from 'node:assert/strict'
import { Control } from './Control.mjs'

describe('Control', () => {

  it('Should initialize', async () => {
    const control = new Control()

    assert.equal(control.initialized, false)

    await control.init({ })

    assert.ok(control.initialized)
  })

})
