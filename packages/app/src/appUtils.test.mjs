// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { describe } from 'node:test'
import { it } from 'node:test'
import assert from 'node:assert/strict'
import { AppUtils } from './appUtils.mjs'

describe('Test App Utils', () => {

  it('Should throw', () => {
    assert.throws(() => { new AppUtils() }, {
      name: 'Error',
      message: 'data directory required'
    })
  })

})
