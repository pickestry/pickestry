// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { describe } from 'node:test'
import { it } from 'node:test'
import { afterEach } from 'node:test'
import { beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { utils } from '../utils.mjs'
import { PipelineControl } from './PipelineControl.mjs'

describe('PipelineControl', () => {

  let control

  beforeEach(async () => {
    control = await utils.init(PipelineControl)
  })

  afterEach(async () => {
    await control.cleanup()
  })

  describe('Jobs', () => {

    it('should throw when product not found', async () => {
      await assert.rejects(control.createJob({ id: '32432423' }), {
        name: 'Error',
        message: 'product not found'
      })
    })

    it('should create simple', async (t) => {
      t.mock.method(control, 'emitDataEvent')

      const o = await control.createJob({ id: '5' })

      assert.equal(o.ProductId, 5)
      assert.equal(o.barcodeMulti, 1)
      assert.equal(o.name, 'Making 1 Cold Cups - Recycled Plastic - 98mm - 12oz/case1000')
      assert.equal(o.plannedQty, 1)
      assert.equal(o.progressCounter, 0)
      assert.equal(o.rank, 1)
      assert.equal(o.refNum, 'JOB-0001')
      assert.equal(o.start, undefined)
      assert.equal(o.status, 'created')

      // test events
      assert.equal(control.emitDataEvent.mock.calls.length, 1)
      const call = control.emitDataEvent.mock.calls[0]
      assert.deepEqual(call.arguments, [
        'job',
        'created', {
          id: 1,
          refNum: 'JOB-0001'
        }
      ])
    })

    it('should create and assign to pipeline', async () => {
      const o = await control.createJob({
        id: '5',
        pipelineId: '2'
      })

      assert.equal(o.ProductId, 5)
      assert.equal(o.barcodeMulti, 1)
      assert.equal(o.name, 'Making 1 Cold Cups - Recycled Plastic - 98mm - 12oz/case1000')
      assert.equal(o.plannedQty, 1)
      assert.equal(o.progressCounter, 0)
      assert.equal(o.rank, 1)
      assert.equal(o.refNum, 'JOB-0001')
      assert.equal(o.start, undefined)
      assert.equal(o.status, 'started')
    })

    it('should create full', async () => {
      const o = await control.createJob({
        id: '5',
        pipelineId: '2',
        name: 'My Full Job',
        plannedQty: 520,
        start: 1708911438900
      })

      assert.equal(o.ProductId, 5)
      assert.equal(o.barcodeMulti, 1)
      assert.equal(o.name, 'My Full Job')
      assert.equal(o.plannedQty, 520)
      assert.equal(o.progressCounter, 0)
      assert.equal(o.rank, 1)
      assert.equal(o.refNum, 'JOB-0001')
      assert.deepEqual(o.start, new Date(1708911438900))
      assert.equal(o.status, 'started')
    })

    it('should bump refNum', async (t) => {
      t.mock.method(control, 'emitDataEvent')

      for(let i = 0; i < 3; i++) {
        await control.createJob({
          id: '5',
          pipelineId: '2'
        })
      }

      const o = await control.createJob({
        id: '5',
        pipelineId: '2'
      })

      assert.equal(o.refNum, 'JOB-0004')

      // test events
      assert.equal(control.emitDataEvent.mock.calls.length, 4)
    })

    it('should create from package', async (t) => {
      t.mock.method(control, 'emitDataEvent')

      const o = await control.createJob({
        id: '2' ,
        fromPackage: true
      })

      assert.equal(o.ProductId, 18)
      assert.equal(o.PackageId, 2)
      assert.equal(o.barcode, 'U-000002')
      assert.equal(o.barcodeCount, 1)
      assert.equal(o.barcodeMulti, 150)
      assert.equal(o.name, 'Making 1 Curry Paste - Green Masala')
      assert.equal(o.plannedQty, 1, 'planned qty')
      assert.equal(o.progressCounter, 0)
      assert.equal(o.rank, 1)
      assert.equal(o.refNum, 'JOB-0001')
      assert.equal(o.start, undefined)
      assert.equal(o.status, 'created')

      // test events
      assert.equal(control.emitDataEvent.mock.calls.length, 1)
      const call = control.emitDataEvent.mock.calls[0]
      assert.deepEqual(call.arguments, [
        'job',
        'created', {
          id: 1,
          refNum: 'JOB-0001'
        }
      ])
    })

    it('should create from package with qty', async () => {
      const o = await control.createJob({
        id: '2' ,
        fromPackage: true,
        plannedQty: 600
      })

      assert.equal(o.barcodeCount, 4)
      assert.equal(o.barcodeMulti, 150)
      assert.equal(o.plannedQty, 600, 'planned qty')
      assert.equal(o.progressCounter, 0)
      assert.equal(o.rank, 1)
      assert.equal(o.refNum, 'JOB-0001')
      assert.equal(o.start, undefined)
      assert.equal(o.status, 'created')
    })

    it('should assign existing to pipeline', async (t) => {
      const job = await control.createJob({ id: '5' })

      assert.equal(job.PipelineStageId, undefined)

      // for events
      t.mock.method(control, 'emitDataEvent')

      const o = await control.assignJobToPipeline({
        jobId: job.id,
        pipelineId: '3'
      })

      assert.equal(o.PipelineStageId, 7)

      // test events
      assert.equal(control.emitDataEvent.mock.calls.length, 1)
      const call = control.emitDataEvent.mock.calls[0]
      assert.deepEqual(call.arguments, [
        'job',
        'assigned', {
          id: 1,
          refNum: 'JOB-0001'
        }
      ])
    })

    it('should throw when bumping without a pipeline ', async () => {
      const job = await control.createJob({ id: '5' })

      await assert.rejects(control.bumpJobCounter({ id: job.id }), {
        name: 'Error',
        message: 'assign to pipeline'
      })
    })

    it('should bump progress counter by one', async (t) => {
      const job = await control.createJob({
        id: '5',
        pipelineId: '2'
      })

      assert.equal(job.PipelineStageId, 4)

      // for events
      t.mock.method(control, 'emitDataEvent')

      await control.bumpJobCounter({ id: '1' })

      const o = await control.persist.findPipelineJobByPk(1)

      assert.equal(o.get('progressCounter'), 1)
      assert.equal(o.get('PipelineStageId'), 5)

      // test events
      assert.equal(control.emitDataEvent.mock.calls.length, 1)
      const call = control.emitDataEvent.mock.calls[0]
      assert.deepEqual(call.arguments, [
        'job',
        'updated', {
          id: 1,
          refNum: 'JOB-0001'
        }
      ])
    })

    it('should remove', async (t) => {
      await control.createJob({
        id: '5',
        pipelineId: '2'
      })

      // for events
      t.mock.method(control, 'emitDataEvent')

      const removed = await control.removeJob({ id: '1' })

      assert.equal(removed.PipelineId, 2)
      assert.equal(removed.rank, null)

      // test events
      assert.equal(control.emitDataEvent.mock.calls.length, 1)
      const call = control.emitDataEvent.mock.calls[0]
      assert.deepEqual(call.arguments, [
        'job',
        'removed', {
          id: '1',
          refNum: 'JOB-0001',
          location: 3,
          product: 5,
          progress: 0
        }
      ])
    })

    it('should move job', async (t) => {
      const { id } = await control.createJob({
        id: '5',
        pipelineId: '2'
      })

      t.mock.method(control, 'emitDataEvent')

      const job = await control.moveJob({
        job: id,
        stage: 6
      })

      assert.equal(job.rank, 1)
      assert.equal(job.PipelineStageId, 6)

      // test events
      assert.equal(control.emitDataEvent.mock.calls.length, 1)
    })
  })

  describe('Pipelines', () => {

    it('should create simple', async (t) => {
      t.mock.method(control, 'emitDataEvent')

      const o = await control.savePipeline({
        name: 'My Pipeline',
        location: '1'
      })

      assert.equal(o.name, 'My Pipeline')
      assert.equal(o.LocationId, '1')

      const stages = o.stages

      assert.equal(stages.length, 3)

      assert.equal(stages[0].name, 'Pending')
      assert.equal(stages[0].position, 1)
      assert.equal(stages[1].name, 'Producing')
      assert.equal(stages[1].position, 2)
      assert.equal(stages[2].name, 'Finished')
      assert.equal(stages[2].position, 3)

      // test events
      assert.equal(control.emitDataEvent.mock.calls.length, 1)
      const call = control.emitDataEvent.mock.calls[0]
      assert.deepEqual(call.arguments, [
        'pipeline',
        'created', {
          id: 4,
          name: 'My Pipeline'
        }
      ])
    })

    it('should destroy', async(t) => {
      const o = await control.savePipeline({
        name: 'My Pipeline',
        location: '1'
      })

      t.mock.method(control, 'emitDataEvent')

      await control.destroyPipeline({ id: ''+o.id })

      // test events
      assert.equal(control.emitDataEvent.mock.calls.length, 1)
      const call = control.emitDataEvent.mock.calls[0]
      assert.deepEqual(call.arguments, [
        'pipeline',
        'deleted', {
          id: '4',
          name: 'My Pipeline'
        }
      ])
    })
  })
})
