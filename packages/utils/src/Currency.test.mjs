// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { describe } from 'node:test'
import { it } from 'node:test'
import assert from 'node:assert/strict'
import { displayAmount } from './Currency.mjs'

describe('Test Currency', () => {

  it('Should display in us', () => {
    assert.equal(displayAmount(10044, 'usd'), '$100.44')
  })

})
