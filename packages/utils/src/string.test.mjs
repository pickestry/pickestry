// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { describe } from 'node:test'
import { it } from 'node:test'
import assert from 'node:assert/strict'
import { isBlank } from './string.mjs'
import { isNotBlank } from './string.mjs'

describe('string', () => {

  it('Should return true for space', () => {
    assert.ok(isBlank(''))
  })

  it('Should return true for undefined', () => {
    assert.ok(isBlank(undefined))
  })

  it('Should return true for null', () => {
    assert.ok(isBlank(undefined))
  })

  it('Should return true for many spaces', () => {
    assert.ok(isBlank('         '))
  })

  it('should return false for not blank', () => {
    assert.equal(isBlank('Hi'), false)
  })

  it('should return true for not blank', () => {
    assert.ok(isNotBlank('Hi'))
  })

})
