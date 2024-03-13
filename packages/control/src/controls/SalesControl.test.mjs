// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { describe } from 'node:test'
import { it } from 'node:test'
import { beforeEach } from 'node:test'
import { afterEach } from 'node:test'
import assert from 'node:assert/strict'
import { utils } from '../utils.mjs'
import { SalesControl } from './SalesControl.mjs'

describe('SalesControl', () => {

  let control

  beforeEach(async () => { control = await utils.init(SalesControl) })

  afterEach(async () => { await control.__cleanup() })

  it('should throw when no items defined', async (t) => {
    // for events
    t.mock.method(control, 'emitDataEvent')

    await assert.rejects(control.createSalesOrder({
      customer: '1',
      currency: 'cad'
    }), {
      name: 'SchemaError',
      details: [{
        instancePath: '',
        keyword: 'required',
        message: 'must have required property \'items\'',
        params: { missingProperty: 'items' },
        schemaPath: '#/required'
      }]
    })

    // test events
    assert.equal(control.emitDataEvent.mock.calls.length, 0)
  })

  it('should throw with empty items', async () => {
    await assert.rejects(control.createSalesOrder({
      customer: '1',
      currency: 'cad',
      items: []
    }), {
      name: 'SchemaError',
      details: [{
        instancePath: '/items',
        keyword: 'minItems',
        message: 'must NOT have fewer than 1 items',
        params: { limit: 1 },
        schemaPath: '#/properties/items/minItems'
      }]
    })
  })

  it('should create order', async(t) => {
    // for events
    t.mock.method(control, 'emitDataEvent')

    const o = await control.createSalesOrder({
      customer: '1',
      notes: 'Some notes here',
      currency: 'usd',
      items: [{ id: '5' }]
    })

    assert.equal(o.CustomerId, 1, 'Customer should exist')
    assert.equal(o.currency, 'usd', 'Currency should exist')
    assert.equal(o.notes, 'Some notes here'),
    assert.equal(o.refNum, 'SO-0001')
    assert.equal(o.status, 'created')

    // test events
    assert.equal(control.emitDataEvent.mock.calls.length, 1)
    const call = control.emitDataEvent.mock.calls[0]
    assert.deepEqual(call.arguments, [
    'sales_order',
    'created', {
        id: 1,
        refNum: 'SO-0001'
      }
    ])
  })

  it('should create full order with many items', async () => {
    await control.createSalesOrder({
      customer: '1',
      notes: 'Some notes here',
      shippingAddress: 'My Address Line 1\nMy Address Line 2',
      currency: 'usd',
      items: [{
        id: '5',
        qty: 40,
        amount: 5500,
        total: 22000,
        tax: [{ value: 1300, name: 'HST'}]
      }, {
        id: '6',
        qty: 25,
        amount: 178,
        total: 2450,
        tax: [{ value: 1300, name: 'HST'}]
      }]
    })

    const model = await control.persist.findSalesOrderByPk(1, { include: [{ association: 'items' }] })

    const o = model.toJSON()

    assert.equal(o.CustomerId, 1)
    assert.equal(o.shippingAddress, 'My Address Line 1\nMy Address Line 2')
    assert.equal(o.currency, 'usd')
    assert.equal(o.notes, 'Some notes here')
    assert.equal(o.refNum, 'SO-0001')
    assert.equal(o.status, 'created')

    const firstItem = o.items[0].SalesOrderItem
    assert.equal(firstItem.ProductId, 5)
    assert.equal(firstItem.amount, 5500)
    assert.equal(firstItem.currency, 'usd')
    assert.equal(firstItem.qty, 40)
    assert.equal(firstItem.total, 22000)

    const secondItem = o.items[1].SalesOrderItem
    assert.equal(secondItem.ProductId, 6)
    assert.equal(secondItem.amount, 178)
    assert.equal(secondItem.currency, 'usd')
    assert.equal(secondItem.qty, 25)
    assert.equal(secondItem.total, 2450)
  })


  it('should update order by removing an item', async (t) => {
    await control.createSalesOrder({
      customer: '1',
      notes: 'Some notes here',
      shippingAddress: 'My Address Line 1\nMy Address Line 2',
      currency: 'usd',
      items: [{
        id: '5',
        qty: 40,
        amount: 5500,
        total: 22000,
        tax: [{ value: 1300, name: 'HST'}]
      }, {
        id: '6',
        qty: 25,
        amount: 178,
        total: 2450,
        tax: [{ value: 1300, name: 'HST'}]
      }]
    })

    // for events
    t.mock.method(control, 'emitDataEvent')

    await control.updateSalesOrder({
      id: '1',
      notes: 'Some notes here',
      shippingAddress: 'My Address Line 1\nMy Address Line 2',
      status: 'preparing',
      items: [{
        id: '6',
        qty: 20,
        amount: 150,
        total: 1450
      }]
    })

    const model = await control.persist.findSalesOrderByPk(1, { include: [{ association: 'items' }] })

    const o = model.toJSON()

    assert.equal(o.CustomerId, 1)
    assert.equal(o.shippingAddress, 'My Address Line 1\nMy Address Line 2')
    assert.equal(o.currency, 'usd')
    assert.equal(o.notes, 'Some notes here')
    assert.equal(o.refNum, 'SO-0001')
    assert.equal(o.status, 'preparing')

    assert.equal(o.items.length, 1)

    const item = o.items[0].SalesOrderItem

    assert.equal(item.ProductId, 6)
    assert.equal(item.amount, 150)
    assert.equal(item.currency, 'usd')
    assert.equal(item.qty, 20)
    assert.equal(item.total, 1450)

    // test events
    assert.equal(control.emitDataEvent.mock.calls.length, 1)
    const call = control.emitDataEvent.mock.calls[0]
    assert.deepEqual(call.arguments, [
    'sales_order',
    'updated', {
      id: 1,
      refNum: 'SO-0001'
      }
    ])
  })

  it('should export pdf', async (context) => {
    await control.createSalesOrder({
      customer: '1',
      notes: 'Some notes here',
      shippingAddress: 'My Address Line 1\nMy Address Line 2',
      currency: 'usd',
      items: [{
        id: '5',
        qty: 40,
        amount: 5500,
        total: 22000,
        tax: [{ value: 1300, name: 'HST'}]
      }, {
        id: '6',
        qty: 25,
        amount: 178,
        total: 2450,
        tax: [{ value: 1300, name: 'HST'}]
      }]
    })

    context.mock.timers.enable({ apis: ['Date'], now: 1707776146234 })

    const { content, name, type } = await control.createPDFSalesOrder({ id: '1' })

    const blob = new Blob([content], { type })

    assert.ok(await utils.checkFile(blob, name))
  })

  it('should add discounts when creating', async () => {
    await control.createSalesOrder({
      customer: '1',
      notes: 'Some notes here',
      shippingAddress: 'My Address Line 1\nMy Address Line 2',
      currency: 'usd',
      items: [{
        id: '5',
        qty: 40,
        amount: 5500,
        total: 22000,
        tax: [{ value: 1300, name: 'HST'}]
      }, {
        id: '6',
        qty: 25,
        amount: 178,
        total: 2450,
        tax: [{ value: 1300, name: 'HST'}]
      }],
      discounts: [{
        type: 'fixed',
        currency: 'usd',
        amount: 1000
      }]
    })

    const model = await control.persist.findSalesOrderByPk(1, { include: [{ association: 'items' }] })

    const o = model.toJSON()

    assert.deepEqual(o.discounts, [{
      amount: 1000,
      currency: 'usd',
      type: 'fixed'
    }])
  })

   it('should add discounts when updating', async () => {
    const ITEMS = [{
        id: '5',
        qty: 40,
        amount: 5500,
        total: 22000,
        tax: [{ value: 1300, name: 'HST'}]
      }, {
        id: '6',
        qty: 25,
        amount: 178,
        total: 2450,
        tax: [{ value: 1300, name: 'HST'}]
      }]
    await control.createSalesOrder({
      customer: '1',
      notes: 'Some notes here',
      shippingAddress: 'My Address Line 1\nMy Address Line 2',
      currency: 'usd',
      items: ITEMS
    })

    await control.updateSalesOrder({
      id: '1',
      items: ITEMS,
      discounts: [{
        name: 'DISC',
        amount: 10,
        currency: 'usd',
        type: 'fixed'
      }]
    })

    const model = await control.persist.findSalesOrderByPk(1, { include: [{ association: 'items' }] })

    const o = model.toJSON()

    assert.deepEqual(o.discounts, [{
      amount: 10,
      currency: 'usd',
      name: 'DISC',
      type: 'fixed'
    }])
  })
})
