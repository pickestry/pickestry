// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { describe } from 'node:test'
import { it } from 'node:test'
import assert from 'node:assert/strict'
import { afterEach } from 'node:test'
import { beforeEach } from 'node:test'
import { utils } from '../utils.mjs'
import { CommonControl } from './CommonControl.mjs'

describe('CommonControl', () => {

  let control

  beforeEach(async () => {
    control = await utils.init(CommonControl)
  })

  afterEach(async () => {
    await control.__cleanup()
  })

  it('Should save entity', async (t) => {
    // for events
    t.mock.method(control, 'emitDataEvent')

    const { name } = await control.saveEntity({
      model: 'Customer',
      data: {
        name: 'My Customer 1'
      }
    })

    assert.equal(name, 'My Customer 1')

    // test events
    assert.equal(control.emitDataEvent.mock.calls.length, 1)
    const call = control.emitDataEvent.mock.calls[0]
    assert.deepEqual(call.arguments, [
      'Customer',
      'created', {
        id: 5,
        name: 'My Customer 1'
      }
    ])
  })

  it('Should update entity', async (t) => {
    const { id } = await control.saveEntity({
      model: 'Customer',
      data: {
        name: 'My Customer 1'
      }
    })

    // for events
    t.mock.method(control, 'emitDataEvent')

    const { name } = await control.saveEntity({
      model: 'Customer',
      data: {
        id,
        name: 'My Customer 1 CHANGED'
      }
    })

    assert.equal(name, 'My Customer 1 CHANGED')

    // test events
    assert.equal(control.emitDataEvent.mock.calls.length, 1)
    const call = control.emitDataEvent.mock.calls[0]
    assert.deepEqual(call.arguments, [
      'Customer',
      'updated', {
        id: 5,
        name: 'My Customer 1 CHANGED'
      }
    ])
  })

  it('Should throw on no model', async () => {
    await assert.rejects(control.saveEntity({ data: {}}), {
      name: 'Error',
      message: 'Model undefined not found'
    })
  })

  it('Should throw on unknown model', async () => {
    await assert.rejects(control.saveEntity({ model: 'FooBar', data: {}}), {
      name: 'Error',
      message: 'Model FooBar not found'
    })
  })

  it('Should throw when no entity found', async () => {
    await assert.rejects(control.getEntity({ model: 'Customer', id: '3000' }), {
      name: 'SequelizeEmptyResultError'
    })
  })

  it('Should fetch collection', async () => {
    await control.persist.seed()

    const a = await control.getCollection({ model: 'Customer' })

    assert.equal(a.count, 4)
    assert.equal(a.data[0].name, 'Vivian Weiss')
  })

  it('Should destroy entity', async () => {
    await control.persist.seed()

    await control.destroyEntity({ model: 'Customer', id: '1' })

    const a = await control.getCollection({ model: 'Customer' })

    assert.equal(a.count, 3)
  })

})
