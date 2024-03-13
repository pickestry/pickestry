// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { describe } from 'node:test'
import { it } from 'node:test'
import { afterEach } from 'node:test'
import { beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { utils } from '../utils.mjs'
import { BarcodeControl } from './BarcodeControl.mjs'

describe('BarcodeControl', () => {

  let control

  beforeEach(async () => {
    control = await utils.init(BarcodeControl)
  })

  afterEach(async () => {
    await control.__cleanup()
  })

  describe('Barcodes in products', () => {
    it('should add barcode to product', async (t) => {
      // for events
      t.mock.method(control, 'emitDataEvent')

      const o = await control.addBarcodeToProduct({
        id: '1',
        v: 'U-100005'
      })

      assert.deepEqual(o, {
        ProductId: '1',
        id: 12,
        value: 'U-100005'
      })

      // test events
      assert.equal(control.emitDataEvent.mock.calls.length, 1)
      const call = control.emitDataEvent.mock.calls[0]
      assert.deepEqual(call.arguments, [
        'product',
        'updated', {
          id: '1',
          name: 'Cold Cups - Recycled Plastic - 98mm'
        }
      ])
    })

    it('should throw on unkonwn product', async () => {
      await assert.rejects(control.addBarcodeToProduct({ id: '222000' , v: '1234' }),
      {
        name: 'Error',
        message: 'product not found'
      }
      )
    })

    it('should throw on blank barcode', async () => {
      await assert.rejects(control.addBarcodeToProduct({
        id: '1',
        v: '   '
      }), {
        name: 'Error',
        message: 'barcode required'
      })
    })

    it('should throw when barcode exists', async () => {
      await assert.rejects(control.addBarcodeToProduct({
        id: '1',
        v: 'U-000001'
      }), {
        name: 'Error',
        message: 'barcode exists'
      })
    })

    it('should remove barcode from product', async (t) => {
      await control.addBarcodeToProduct({
        id: '1',
        v: 'U-100005'
      })

      t.mock.method(control, 'emitDataEvent')

      const { valid } = await control.removeBarcodeFromProduct({ id: '1' })

      assert.ok(valid)

      const p = await control.persist.findProductByPk(1, { include: [{ association: 'Barcode' }] })

      assert.equal(p.Barcode, null)

      // test events
      assert.equal(control.emitDataEvent.mock.calls.length, 1)
      const call = control.emitDataEvent.mock.calls[0]
      assert.deepEqual(call.arguments, [
        'product',
        'updated', {
          id: '1',
          name: 'Cold Cups - Recycled Plastic - 98mm'
        }
      ])
    })

    it('should throw when product has no barcode', async () => {
      await assert.rejects(control.removeBarcodeFromProduct({ id: '1' }), {
        name: 'Error',
        message: 'no barcode found'
      })
    })

    it('should throw when try to add on a product that already has', async (t) => {
      // for events
      t.mock.method(control, 'emitDataEvent')

      await assert.rejects(control.addBarcodeToProduct({
        id: '15',
        v: 'U-100004'
      }), {
        name: 'Error',
        message: 'has barcode'
      })

      // test events
      assert.equal(control.emitDataEvent.mock.calls.length, 0)
    })
  })

  describe('Barcodes in packages', () => {

    it('should add barcode', async (t) => {
      // for events
      t.mock.method(control, 'emitDataEvent')

      const o = await control.addBarcodeToPackage({
        id: '5',
        v: 'U-100005'
      })

      assert.deepEqual(o, {
        PackageId: '5',
        id: 12,
        value: 'U-100005'
      })

      // test events
      assert.equal(control.emitDataEvent.mock.calls.length, 1)
      const call = control.emitDataEvent.mock.calls[0]
      assert.deepEqual(call.arguments, [
        'package',
        'updated', {
          id: '5',
          name: '5000 Cold Cups - Recycled Plastic - 98mm - 9oz/case5000'
        }
      ])
    })

    it('should throw on blank barcode', async () => {
      await assert.rejects(control.addBarcodeToPackage({
        id: '1',
        v: '   '
      }), {
        name: 'Error',
        message: 'barcode required'
      })
    })

    it('should throw when barcode exists', async () => {
      await assert.rejects(control.addBarcodeToPackage({
        id: '1',
        v: 'U-000001'
      }), {
        name: 'Error',
        message: 'barcode exists'
      })
    })

    it('should throw when trying to add on a package that already has', async (t) => {
      // for events
      t.mock.method(control, 'emitDataEvent')

      await assert.rejects(control.addBarcodeToPackage({
        id: '1',
        v: 'U-100004'
      }), {
        name: 'Error',
        message: 'has barcode'
      })

      // test events
      assert.equal(control.emitDataEvent.mock.calls.length, 0)
    })

    it('Should remove barcode', async (t) => {
      await control.addBarcodeToPackage({
        id: '5',
        v: 'U-100005'
      })

      t.mock.method(control, 'emitDataEvent')

      const { valid } = await control.removeBarcodeFromPackage({ id: '5' })

      assert.ok(valid)

      const p = await control.persist.findPackageByPk(5, { include: [{ association: 'Barcode' }] })

      assert.equal(p.Barcode, null)

      // test events
      assert.equal(control.emitDataEvent.mock.calls.length, 1)
      const call = control.emitDataEvent.mock.calls[0]
      assert.deepEqual(call.arguments, [
        'package',
        'updated', {
          id: '5',
          name: '5000 Cold Cups - Recycled Plastic - 98mm - 9oz/case5000'
        }
      ])
    })

  })


  it('should return barcode exists', async () => {
    const {
      valid,
      message
    } = await control.checkBarcodeExists({ v: 'U-000001' })

    assert.equal(valid, false)
    assert.equal(message, 'barcode exists')
  })

  it('should return barcode does not exist', async () => {
    const { valid } = await control.checkBarcodeExists({ v: 'U-230001' })

    assert.ok(valid)
  })

  it('should throw on unkonwn location', async () => {
    await assert.rejects(control.createChannels({ id: 80 }), {
      name: 'Error',
      message: 'location not found'
    })
  })

  it('should not create duplicate locations', async () => {
    await control.createChannels({ id: 3 })

    const channels = await control.persist.findAllChannels({ where: { LocationId: 3 } })

    assert.equal(channels.length, 1)
  })

  it('should get all channels', async () => {
    const { count } = await control.getAllChannels()

    assert.equal(count, 9)
  })

  it('should link device to channel', async (t) => {
    t.mock.method(control, 'emitDataEvent')

    const device = await control.linkDevice({
      id: 'dev:1',
      channel: 3
    })

    assert.deepEqual(device, {
      ChannelId: 3,
      id: 5,
      mid: 'dev:1'
    })

    assert.equal(control.emitDataEvent.mock.calls.length, 1)
    const call = control.emitDataEvent.mock.calls[0]
    assert.deepEqual(call.arguments, [
      'device',
      'linked', { mid: 'dev:1' }
    ])
  })

  it('should unlink device', async (t) => {
    await control.linkDevice({
      id: 'dev:1',
      channel: 3
    })

    t.mock.method(control, 'emitDataEvent')

    await control.unlinkDevice({ id: 'dev:1' })

    assert.equal(control.emitDataEvent.mock.calls.length, 1)
    const call = control.emitDataEvent.mock.calls[0]
    assert.deepEqual(call.arguments, [
      'device',
      'unlinked', { mid: 'dev:1' }
    ])
  })

})
