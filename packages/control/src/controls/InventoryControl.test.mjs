// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { describe } from 'node:test'
import { it } from 'node:test'
import { beforeEach } from 'node:test'
import { afterEach } from 'node:test'
import assert from 'node:assert/strict'
import { utils } from '../utils.mjs'
import { InventoryControl } from './InventoryControl.mjs'

describe('InventoryControl', () => {

  let control

  beforeEach(async () => {
    control = await utils.init(InventoryControl)
  })

  afterEach(async () => {
    await control.__cleanup()
  })

  it('Should create a tx', async (t) => {
    // events
    t.mock.method(control, 'emitDataEvent')

    const tx = await control.createInventoryTx({
      product: '4',
      location: '2',
      type: 'in',
      count: 10
    })

    assert.equal(tx.LocationId, '2')
    assert.equal(tx.ProductId, '4')
    assert.equal(tx.count, 10)
    assert.equal(tx.type, 'in')

    const item = tx.__item
    assert.equal(item.LocationId, 2)
    assert.equal(item.Product.id, 4)
    assert.equal(item.count, 10)

    // test events
    assert.equal(control.emitDataEvent.mock.calls.length, 1)
    const call = control.emitDataEvent.mock.calls[0]
    assert.deepEqual(call.arguments, [
      'tx',
      'created', {
        id: 1,
        name: 'Cold Cups - Recycled Plastic - 98mm - 12oz/pack50'
      }
    ])

  })

  it('should update inventory item', async () => {
    await control.createInventoryTx({
      product: '4',
      location: '2',
      type: 'in',
      count: 2000
    })

    const tx = await control.createInventoryTx({
      product: '4',
      location: '2',
      type: 'out',
      count: 13
    })

    const item = tx.__item
    assert.equal(item.LocationId, 2)
    assert.equal(item.Product.id, 4)
    assert.equal(item.count, 1987)
  })

  it('should get inventory items', async () => {
    await control.createInventoryTx({
      product: '4',
      location: '2',
      type: 'in',
      count: 2000
    })

    await control.createInventoryTx({
      product: '4',
      location: '2',
      type: 'out',
      count: 43
    })

    await control.createInventoryTx({
      product: '3',
      location: '2',
      type: 'in',
      count: 345
    })

    const { data, count } = await control.getInventoryItems()

    assert.equal(count, 2)

    const firstItem = data[0]
    assert.equal(firstItem.count, 345)

    const secondItem = data[1]
    assert.equal(secondItem.count, 1957)
  })

})
