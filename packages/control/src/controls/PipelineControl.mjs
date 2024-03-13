// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { BaseControl } from '../BaseControl.mjs'
import { pick } from 'lodash-es'
import { get } from 'lodash-es'
import { isNil } from 'lodash-es'
import { head } from 'lodash-es'
import { JobFactory } from '../lib/JobFactory.mjs'


export class PipelineControl extends BaseControl {

  static NAME = 'pipeline'

  async init() {
  }

  async getJobs(payload = {}) {
    this.validate(payload, BaseControl.PAGED_ARGS_SCHEMA)

    const { query } = payload

    return this.withinTx(async (t) => {
      const { not } = this.persist.Op

      const where = this.sequelizeQuery(this.normalizeQuery(query, 'PipelineJob'))

      const order = [['rank', 'ASC']]

      if(!query.rank) {
        where.push({ rank: { [not]: null }})

        order.pop()
        order.push([['id', 'DESC']])
      }

      const jobs = await this.persist.findAllPipelineJobs({
        where,
        limit: 1000,
        include: [{
          association: 'PipelineStage',
          include: [{ association: 'Pipeline' }]
        }],
        rejectOnEmpty: false,
        transaction: t,
        order
      })

      const data = jobs.map((o) => o.toJSON())

      return {
        data,
        count: jobs.length
      }
    })
  }

  async assignJobToPipeline(payload) {
    this.validate(payload, ASSIGN_JOB_TO_PIPELINE)

    const { jobId, pipelineId } = payload

    this.log('Assign job: %s to pipeline: %s', jobId, pipelineId)

    return this.withinTx(async (t) => {
      const pipeline = await this.persist.findEntityById({
        model: 'Pipeline',
        id: pipelineId,
        include: [{ association: 'stages' }]
      }, { transaction: t })

      const firstStage = head(await pipeline.getStages())

      const job = await this.persist.findPipelineJobByPk(jobId, { transaction: t })

      await job.setPipelineStage(firstStage, { transaction: t })

      const json = job.toJSON()

      this.emitDataEvent('job', 'assigned', pick(json, ['id', 'refNum']))

      return json
    })
  }

  /**
   * Create a job
   *
   * @param {object} payload
   * @param {string} payload.id Product id
   * @param [string] payload.pipelineId
   * @param [string] payload.name User defined name of the job
   * @param [date] payload.start Date planning to start this job
   * @param [number] payload.plannedQty How many products to produce (default: 1)
   * @param [boolean] payload.fromPackage Should calculate qty from package (default: false)
   */
  async createJob(payload) {
    this.validate(payload, CREATE_JOB_SCHEMA)

    const {
      id,
      pipelineId,
      name,
      start,
      plannedQty,
      fromPackage = false
    } = payload

    return await this.withinTx(async (t) => {
      const factory = new JobFactory({
        transaction: t,
        persist: this.persist
      })

      await factory.createJob({
        name,
        plannedQty,
        start
      })

      if(fromPackage) {
        await factory.withPackage(id)
      } else {
        await factory.withProduct(id)
      }

      if(pipelineId)
        await factory.withPipeline(pipelineId)

      const job = factory.getInstance()

      const json = job.toJSON()

      this.emitDataEvent('job', 'created', pick(json, ['id', 'refNum']))

      return json
    })
  }

  async removeJob(payload) {
    this.validate(payload, REMOVE_JOB)

    return await this.withinTx(async (t) => {
      const { id } = payload

      this.log('Attempt to remove job with id %s', id)

      const results = await this.persist.findAllPipelineJobs({
        where: { id },
        rejectOnEmpty: false,
        include: [{
          association: 'PipelineStage',
          include: [{association: 'Pipeline',}]
        }]
      }, { transaction: t })

      const job = head(results)

      if(!job) throw new Error('job not found')

      if(isNil(job.rank)) {
        throw new Error('job already removed')
      }

      let locationForEvent

      const maybePipeline = get(job, 'PipelineStage.Pipeline')
      if(maybePipeline) {
        locationForEvent = maybePipeline.get('LocationId')
        await job.setPipelineStage(null)
        await job.setPipeline(maybePipeline.id)

        await job.save({ transaction: t })
      }

      // update ranking
      const { gt } = this.persist.Op
      const rank = job.rank
      for(const _job of await this.persist.findAllPipelineJobs({
        where: { rank: { [gt]: rank } },
        rejectOnEmpty: false,
        sort: [['rank', 'ASC']]
      })) {
        await _job.update({ rank: (_job.rank - 1) }, { transaction: t })
      }

      await job.update({ rank: null }, { transaction: t })

      this.emitDataEvent('job', 'removed', {
        id,
        refNum: job.refNum,
        product: job.ProductId,
        location: locationForEvent,
        progress: job.progressCounter
      })

      const json = job.toJSON()

      this.log('Removed job %s', json.refNum)

      return json
    })
  }

  /**
   * Bump a job's progress counter by one
   */
  async bumpJobCounter(payload) {
    this.validate(payload, BUMP_JOB_COUNTER_SCHEMA)

    const {
      id,
      multi = 1
    } = payload

    const { job_bump_counter_cap } = this.settings
    this.log(job_bump_counter_cap)

    return await this.withinTx(async (t) => {
      const job = await this.persist.findPipelineJobByPk(id, {
        transaction: t,
        include: [{ association: 'PipelineStage' }]
      })

      const progressCounter = job.progressCounter + multi

      if(progressCounter > job.plannedQty && job_bump_counter_cap === true) {
        this.log('cannot exceed planned quantity')

        throw new Error('cannot exceed planned quantity')
      }

      await job.update({ progressCounter }, { transaction: t })

      const stage = await job.getPipelineStage({ transaction: t })

      if(isNil(stage)) throw new Error('assign to pipeline')

      if(stage.position === 2 && (job.progressCounter === job.plannedQty)) {
        const pipeline = await stage.getPipeline({ transaction: t })

        const stages = await pipeline.getStages({
          where: { position: { [this.persist.Op.eq]: 3 } },
          transaction: t
        })

        await job.setPipelineStage(head(stages), { transaction: t })
      } else if(stage.position === 1) {
        const pipeline = await stage.getPipeline({ transaction: t })

        const stages = await pipeline.getStages({
          where: { position: { [this.persist.Op.eq]: 2 } },
          transaction: t
        })

        await job.setPipelineStage(head(stages), { transaction: t })
      }

      const json = job.toJSON()

      this.emitDataEvent('job', 'updated', pick(json, ['id', 'refNum']))

      return json
    })
  }

  async saveIncidentJob(payload) {
    this.validate(payload, SAVE_INCIDENT_SCHEMA)

    const {
      id,
      incidentNote,
      incidentDate
    } = payload

    return await this.withinTx(async (t) => {
      const results = await this.persist.findAllPipelineJobs({
        where: { id },
        rejectOnEmpty: false,
        include: [{
          association: 'PipelineStage',
          include: [{association: 'Pipeline',}]
        }]
      }, { transaction: t })

      const job = head(results)

      // move job to finished
      const stage = await job.getPipelineStage()

      if(stage.position !== 3) {
        const pipeline = await stage.getPipeline()
        const stages = await pipeline.getStages({
          where: {
            position: { [this.persist.Op.eq]: 3 }
          }, transaction: t }
        )
        await job.setPipelineStage(head(stages), { transaction: t })
      }

      // set the incident
      await job.update({
        incident: true,
        incidentNote,
        incidentDate: incidentDate || new Date()
      }, { transaction: t })

      const json = job.toJSON()

      this.emitDataEvent('job', 'updated', pick(json, ['id', 'refNum']))

      return json
    })
  }

  async savePipeline(payload) {
    this.validate(payload, SAVE_PIPELINE)

    this.log('Saving pipeline: %O', payload)

    return await this.withinTx(async (t) => {
      const {
        name,
        location
      } = payload

      const pipeline = await this.persist.createPipeline({
        name: name,
        LocationId: location,
        stages: [
          {
            name: 'Pending',
            position: 1
          },
          {
            name: 'Producing',
            position: 2
          },
          {
            name: 'Finished',
            position: 3
          }]
        }, {
          include: [{ association: 'stages' }],
          transaction: t
        })

        const json = pipeline.toJSON()

        this.emitDataEvent('pipeline', 'created', pick(json, ['id', 'name']))

        return json
    })
  }

  async destroyPipeline(payload) {
    this.validate(payload)

    const { id } = payload

    this.log('Attempt to destroy pipeline with id %s', id)

    return await this.withinTx(async (t) => {
      const results = await this.persist.findAllPipelines({
        where: { id },
        include: [{
          association: 'stages',
          include: { association: 'jobs' }
        }]
      }, {
        transaction: t,
        rejectOnEmpty: false
      })

      // check if has jobs
      const p = head(results)

      if(!p) throw new Error('pipeline not found')

      const found = p.stages.reduce((totalJobs, { jobs }) => totalJobs + jobs.length, 0)

      if(found > 0) {
        throw new Error('pipeline has active jobs')
      }

      await p.destroy({
        cascade: true,
        transaction: t
      })

      const json =  { id, name: p.get('name') }

      this.emitDataEvent('pipeline', 'deleted', json)

      this.log('Destroyed pipeline %O', json)

      return json
    })
  }

  async moveJob(payload) {
    this.validate(payload, MOVE_JOB_SCHEMA)
    const {
      job: jobId,
      stage: stageId
    } = payload

    return await this.withinTx(async (t) => {
      const job = await this.persist.findPipelineJobByPk(jobId, { transaction: t })

      await job.setPipelineStage(stageId, { transaction: t })

      const json = job.toJSON()

      this.emitDataEvent('job', 'update', json)

      return json
    })
  }
}

const ASSIGN_JOB_TO_PIPELINE = {
  type: 'object',
  properties: {
    jobId: {
      oneOf: [
        { type: 'string' },
        { type: 'number' }
      ]
    },
    pipelineId : {
      oneOf: [
        { type: 'string' },
        { type: 'number' }
      ]
    }
  },
  required: [
    'jobId',
    'pipelineId'
  ],
  additionalProperties: false
}

const CREATE_JOB_SCHEMA = {
  type: 'object',
  properties: {
    id: {
      oneOf: [
        { type: 'number' },
        { type: 'string' }
      ]
    },
    pipelineId: {
      oneOf: [
        { type: 'number' },
        { type: 'string' }
      ]
    },
    name: {
      type: 'string'
    },
    start: {
      type: 'number'
    },
    plannedQty: {
      type: 'number'
    },
    fromPackage: {
      type: 'boolean'
    }
  },
  required: ['id'],
  additionalProperties: false
}

const SAVE_PIPELINE = {
  type: 'object',
  properties: {
    location: {
      oneOf: [
        { type: 'string' },
        { type: 'number' }
      ]
    },
    name: {
      type: 'string'
    }
  },
  additionalProperties: false
}

const REMOVE_JOB = {
  type: 'object',
  properties: {
    id: {
      oneOf: [
        { type: 'string' },
        { type: 'number' }
      ]
    }
  },
  required: [ 'id' ],
  additionalProperties: false
}

const SAVE_INCIDENT_SCHEMA = {
  type: 'object',
  properties: {
    id: {
      oneOf: [
        { type: 'string' },
        { type: 'number' }
      ]
    },
    incidentNote: {
      type: 'string'
    },
    incidentDate: {
      type: 'number'
    }
  },
  required: [ 'id' ],
  additionalProperties: false
}

const MOVE_JOB_SCHEMA = {
  type: 'object',
  properties: {
    job: {
      oneOf: [
        { type: 'string' },
        { type: 'number' }
      ]
    },
    stage: {
      oneOf: [
        { type: 'string' },
        { type: 'number' }
      ]
    },
    rank: {
      oneOf: [
        { type: 'string' },
        { type: 'number' }
      ]
    }
  },
  required: [
    'job',
    'stage'
  ]
}

const BUMP_JOB_COUNTER_SCHEMA = {
  type: 'object',
  properties: {
    id: {
      oneOf: [
        { type: 'string' },
        { type: 'number' }
      ]
    },
    multi: {
      type: 'number'
    }
  },
  required: [ 'id' ]
}
