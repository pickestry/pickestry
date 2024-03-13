// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { describe } from 'node:test'
import { it } from 'node:test'
import { beforeEach } from 'node:test'
import { afterEach } from 'node:test'
import assert from 'node:assert/strict'
import { utils } from '../../utils.mjs'
import { TransferJobInventory } from './TransferJobInventory.mjs'

describe('Removing a job', () => {

  let control

  describe('with trigger disabled', () => {

    beforeEach(async () => {
      control = await utils.initAllWithTrigger(TransferJobInventory)
    })

    afterEach(async () => {
      await control.__cleanup()
    })

    it('Should not create tx', async () => {
      const { id } = await control.createJob({ id: '5', pipelineId: 2 })

      await control.bumpJobCounter({ id })

      await control.removeJob({ id })

      const { count } = await control.getInventoryItems()

      assert.equal(count, 0)
    })

  })

  describe('with trigger enabled', () => {

    beforeEach(async () => {
      control = await utils.initAllWithTrigger(TransferJobInventory, {
        make_finished_job_inventory: true,
        make_finished_job_inventory_pairs: [{
          fromId: 3,
          toId: 1
        }]
      })
    })

    afterEach(async () => {
      await control.__cleanup()
    })

    it('creates tx, no location', async () => {
      control.__triggerHandler.onEvent({
        type: 'job.removed',
        data: {
          product: '4',
          count: 10
        }
      })

      const results = await control.getInventoryItems()

      assert.equal(results.count, 1)
    })

    it('creates tx using location mapping', async () => {
      control.__triggerHandler.onEvent({
        type: 'job.removed',
        data: {
          product: 4,
          location: 3,
          progress: 10
        }
      })

      const results = await control.getInventoryItems()

      const o = results.data[0]
      assert.equal(o.count, 10, 'should have the right count')
      assert.equal(o.LocationId, 1)
      assert.equal(o.ProductId, 4)

      assert.equal(results.count, 1)
    })
  })


})
