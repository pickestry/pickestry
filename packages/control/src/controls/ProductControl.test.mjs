// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { describe } from 'node:test'
import { it } from 'node:test'
import { beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { utils } from '../utils.mjs'
import { ProductControl } from './ProductControl.mjs'

describe('ProductControl', () => {

  let control

  beforeEach(async () => {
    control = await utils.init(ProductControl)
  })

  it('Should add part', async (t) => {
    // for events
    t.mock.method(control, 'emitDataEvent')

    await control.addPart({
      id: '1',
      partId: '3',
      qty: 25
    })

    const fetched = await control.persist.findProductByPk(1, {
      include: [{ association: 'parts' }]
    })

    const parts = fetched.get('parts').map((o) => ({
      id: o.get('id'),
      name: o.get('name')
    }))

    assert.equal(parts.length, 1)
    assert.deepEqual(parts[0], {
      id: 3,
      name: 'Cold Cups - Recycled Plastic - 98mm - 9oz/case1000'
    })

    // test events
    assert.equal(control.emitDataEvent.mock.calls.length, 1)
    const call = control.emitDataEvent.mock.calls[0]
    assert.deepEqual(call.arguments, [
      'product',
      'updated', {
        id: 1,
        name: 'Cold Cups - Recycled Plastic - 98mm'
        }
      ])
  })

  it('Should remove part', async (t) => {
    await control.addPart({
      id: '1',
      partId: '3',
      qty: 25
    })

    // for events
    t.mock.method(control, 'emitDataEvent')

    await control.removePart({
      id: '1',
      partId: '3'
    })

    const fetched = await control.persist.findProductByPk(1, {
      include: [{ association: 'parts' }]
    })

    assert.equal(fetched.get('parts').length, 0)

    // test events
    assert.equal(control.emitDataEvent.mock.calls.length, 1)
    const call = control.emitDataEvent.mock.calls[0]
    assert.deepEqual(call.arguments, [
      'product',
      'updated', {
        id: 1,
        name: 'Cold Cups - Recycled Plastic - 98mm'
        }
      ])
  })

  it('Should not remove unknown part', async (t) => {
    await control.addPart({
      id: '1',
      partId: '3',
      qty: 25
    })

    // for events
    t.mock.method(control, 'emitDataEvent')

    await assert.rejects(control.removePart({
      id: '1',
      partId: '5'
    }), {
      name: 'Error',
      message: 'unknown part'
    })

    const fetched = await control.persist.findProductByPk(1, {
      include: [{ association: 'parts' }]
    })

    assert.equal(fetched.get('parts').length, 1)

    // test events
    assert.equal(control.emitDataEvent.mock.calls.length, 0)
  })

  it('should create a variant', async (t) => {
    t.mock.method(control, 'emitDataEvent')

    await control.createVariant({ id: 1,  variant: {
      'Size': '5oz',
      'Misc': 'pack50'
      }
    })

    // test events
    assert.equal(control.emitDataEvent.mock.calls.length, 1)
    const call = control.emitDataEvent.mock.calls[0]
    assert.deepEqual(call.arguments, [
      'product',
      'created', {
        id: 19,
        name: 'Cold Cups - Recycled Plastic - 98mm - 5oz/pack50'
      }
    ])

  })

  it('should save package and generate a name', async (t) => {
    t.mock.method(control, 'emitDataEvent')

    const { id } = await control.savePackage({
      product: '4',
      count: 100
    })

    const pkgModel = await control.persist.findPackageByPk(id, {
      include: [{ association: 'products' }]
    })

    const pkg = pkgModel.toJSON()

    assert.equal(pkg.name, '100 Cold Cups - Recycled Plastic - 98mm - 12oz/pack50')
    assert.equal(pkg.products[0].PackageProduct.count, 100)

    // test events
    assert.equal(control.emitDataEvent.mock.calls.length, 1)
    const call = control.emitDataEvent.mock.calls[0]
    assert.deepEqual(call.arguments, [
      'package',
      'created', {
        id: 6,
        name: '100 Cold Cups - Recycled Plastic - 98mm - 12oz/pack50'
        }
      ])
  })

})
