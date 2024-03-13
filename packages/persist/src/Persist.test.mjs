// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { describe } from 'node:test'
import { it } from 'node:test'
import assert from 'node:assert/strict'

import { models } from './models/index.mjs'
import { customer } from './models/index.mjs'
import { deltas } from './deltas/index.mjs'

import { Persist } from './Persist.mjs'

describe('Persist', () => {

  it('Should initialize', async () => {
    const persist = new Persist()

    assert.equal(persist.initialized, false)

    await persist.init({
      models,
      deltas
    })

    assert.ok(persist.initialized)
  })

  it('Should register models', async () => {
    const persist = new Persist()
    await persist.init({
      models,
      deltas
    })

    const customer = persist.getModel('Customer')

    assert.deepEqual(customer.options.name, {
      plural: 'Customers',
      singular: 'Customer'
    })

    assert.equal(customer.tableName, 'customers')
  })

  it('Should init without deltas', async () => {
    const persist = new Persist()
    await persist.init({ models: [customer] })
    await persist.sync()

    const keys = Object.keys(persist.models)

    assert.equal(keys.length, 1)
    assert.deepEqual(keys, ['Customer'])
  })

  it('Should mangle functions', async () => {
    const persist = new Persist()
    await persist.init({
      models,
      deltas
    })

    const customer = persist.getModel('Customer')

    assert.deepEqual(customer.options.name, {
      plural: 'Customers',
      singular: 'Customer'
    })

    assert.ok(typeof persist.findOneCustomer === 'function')
  })
})
