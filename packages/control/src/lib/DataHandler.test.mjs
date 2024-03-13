// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { describe } from 'node:test'
import { it } from 'node:test'
import { before } from 'node:test'
import { after } from 'node:test'
import assert from 'node:assert/strict'
import { DataHandler } from './DataHandler.mjs'
import { utils } from '../utils.mjs'

describe('Data Handler', () => {

  let control

  before(async () => {
    control = await utils.init()
  })

  after(async () => {
    await control.__cleanup()
  })

  it('Should throw an error when device not found', async () => {
    await control.withinTx(async (t) => {
      const handler = new DataHandler({ transaction: t, persist: control.persist })

      await assert.rejects(handler.init({ id: '1234', data:'1234' }), {
        name: 'Error',
        message: 'device not found'
      })
    })
  })

  it('Should throw an error when data is undefined', async () => {
    await control.withinTx(async (t) => {
      const handler = new DataHandler({ transaction: t, persist: control.persist })

      await assert.rejects(handler.init({ id: '1234', data: undefined }), {
        name: 'Error',
        message: 'no data'
      })
    })
  })

  it('Should throw an error when data is blank', async () => {
    await control.withinTx(async (t) => {
      const handler = new DataHandler({ transaction: t, persist: control.persist })

      await assert.rejects(handler.init({ id: '1234', data: '    ' }), {
        name: 'Error',
        message: 'no data'
      })
    })
  })

  it('Should indicate type `production`', async () => {
    await control.withinTx(async (t) => {
      const handler = new DataHandler({ transaction: t, persist: control.persist })

      await handler.init({ id: '1234:1000#1#1', data: '1234' })

      assert.ok(handler.isProduction)
      assert.equal(handler.isInventory, false)
    })
  })

  it('Should indicate type `inventory`', async () => {
    await control.withinTx(async (t) => {
      const handler = new DataHandler({ transaction: t, persist: control.persist })

      await handler.init({ id: '05e0:1200#1#7', data: '1234' })

      assert.equal(handler.isProduction, false)
      assert.equal(handler.isInventory, true)
    })
  })

  it('Should indicate intent', async () => {
    await control.withinTx(async (t) => {
      const handler = new DataHandler({ transaction: t, persist: control.persist })

      await handler.init({ id: '05e0:1200#1#7', data: '1234' })

      assert.equal(handler.intent, 'in')
    })
  })

  it('Should indicate it has no location', async () => {
    await control.withinTx(async (t) => {
      const handler = new  DataHandler({ transaction: t, persist: control.persist })

      await handler.init({ id: '05e0:1200#1#7', data: '1234' })

      assert.equal(handler.hasLocation, false)
    })
  })

  it('Should indicate it has location', async () => {
    await control.withinTx(async (t) => {
      const handler = new DataHandler({ transaction: t, persist: control.persist })

      await handler.init({ id: '11bb:0001#1#9', data: '1234' })

      assert.equal(handler.hasLocation, true)
    })
  })

  it('Should have location info', async () => {
    await control.withinTx(async (t) => {
      const handler = new DataHandler({ transaction: t, persist: control.persist })

      await handler.init({ id: '11bb:0001#1#9', data: '1234' })

      assert.equal(handler.location_id, 3)
    })
  })

  it('Should get data', async () => {
    await control.withinTx(async (t) => {
      const handler = new DataHandler({ transaction: t, persist: control.persist })

      await handler.init({ id: '11bb:0001#1#9', data: '1234567' })

      assert.equal(handler.data, '1234567')
    })
  })

  it('Should have a package', async () => {
    await control.withinTx(async (t) => {
      const handler = new DataHandler({ transaction: t, persist: control.persist })

      await handler.init({ id: '11bb:0001#1#9', data: 'U-000001' })

      assert.equal(handler.hasProduct, false)
      assert.equal(handler.hasPackage, true)
      assert.equal(handler.package_id, 1)
    })
  })

  it('Should have a product', async () => {
    await control.withinTx(async (t) => {
      const handler = new DataHandler({ transaction: t, persist: control.persist })

      await handler.init({ id: '11bb:0001#1#9', data: 'U-000004' })

      assert.equal(handler.hasProduct, true)
      assert.equal(handler.hasPackage, false)
      assert.equal(handler.product_id, 15)
    })
  })

})
