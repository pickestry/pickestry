// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { BaseControl } from '../BaseControl.mjs'
import { pick } from 'lodash-es'
import { get } from 'lodash-es'
import { isEmpty } from 'lodash-es'
import { isNil } from 'lodash-es'
import { isString } from 'lodash-es'
import { head } from 'lodash-es'
import { enums } from '@pickestry/defs'
import { DataHandler } from '../lib/DataHandler.mjs'
import { InventoryTxHandler } from '../lib/InventoryTxHandler.mjs'

const CHANNEL_TYPES = enums.channelTypes

const SCAN_INTENT = enums.scanIntent

export class BarcodeControl extends BaseControl {

  static NAME = 'barcode'

  async init() {
  }

  async addBarcodeToProduct({ id, v }) {
    const value = v?.trim()

    this.log('Add barcode: %s to product: %s', value, id)

    if(!id) throw new Error('product required')

    if(!value) throw new Error('barcode required')

    return await this.withinTx(async (t) => {
      const found = await this.persist.findAllBarcodes({ where: { value } }, {
        transaction: t
      })

      if(!isEmpty(found)) throw new Error('barcode exists')

      const product = await this.persist.findProductByPk(id, {
        transaction: t,
        include: [{ association: 'Barcode' }],
        rejectOnEmpty: false
      })

      if(!product) throw new Error('product not found')

      if(!isNil(product.Barcode)) throw new Error('has barcode')

      const barcode = await this.persist.createBarcode({ value }, { transaction: t })
      await barcode.setProduct(id, { transaction: t })

      this.emitDataEvent('product', 'updated', { id, name: product.name })

      return barcode.toJSON()
    })
  }

  async addBarcodeToPackage({ id, v }) {
    const value = v?.trim()

    this.log('Add barcode: %s to package: %s', value, id)

    if(!id) throw new Error('package required')

    if(!value) throw new Error('barcode required')

    return await this.withinTx(async (t) => {
      const found = await this.persist.findAllBarcodes({ where: { value } }, { transaction: t })

      if(!isEmpty(found)) throw new Error('barcode exists')

      const pkg = await this.persist.findPackageByPk(id, {
        transaction: t,
        include: [{ association: 'Barcode' }],
        rejectOnEmpty: false
      })

      if(!pkg) throw new Error('pkg not found')

      if(!isNil(pkg.Barcode)) throw new Error('has barcode')

      const barcode = await this.persist.createBarcode({ value }, { transaction: t })
      await barcode.setPackage(id, { transaction: t })

      this.emitDataEvent('package', 'updated', { id, name: pkg.name })

      return barcode.toJSON()
    })
  }

  async removeBarcodeFromProduct({ id }) {
    this.log('Remove barcode from product %s', id)

    if(!id) throw new Error('product required')

    return await this.withinTx(async (t) => {
      const found = await this.persist.findProductByPk(id, {
        transaction: t,
        rejectOnEmpty: false
      })

      if(found) {
        const barcode = await found.getBarcode({ transaction: t })

        if(!barcode) throw new Error('no barcode found')

        await barcode.destroy({ transaction: t })

        this.emitDataEvent('product', 'updated', { id, name: found.name })
      }

      return { valid: true }
    })
  }

  async removeBarcodeFromPackage({ id }) {
    this.log('Remove barcode from package %s', id)

    if(!id) throw new Error('package required')

    return await this.withinTx(async (t) => {
      const found = await this.persist.findPackageByPk(id, {
        include: [{ association: 'Barcode' }],
        transaction: t,
        rejectOnEmpty: false
      })

      if(found) {
        const barcode = await found.getBarcode({ transaction: t })

        if(!barcode) throw new Error('no barcode found')

        await barcode.destroy({ transaction: t })

        this.emitDataEvent('package', 'updated', { id, name: found.name })
      }

      return { valid: true }
    })
  }

  async checkBarcodeExists({ v } = {}) {
    if(isNil(v) || (isString(v) && v.trim() === '')) throw new Error('invalid value')

    const found = await this.persist.findAllBarcodes({ where: { value: v } })

    const valid = isEmpty(found)

    return {
      valid,
      message: valid ? undefined : 'barcode exists'
    }
  }

  async createChannels(payload) {
    this.log('Create channels: %O', payload)

    const { id } = payload

    if(!id) throw new Error('location required')

    return await this.withinTx(async (t) => {
      const location = await this.persist.findLocationByPk(id, { transaction: t, rejectOnEmpty: false })

      if(!location) throw new Error('location not found')

      for(const type of CHANNEL_TYPES) {
        if(type === 'inventory') {
          for(const intent of SCAN_INTENT) {
            if(this.#shouldCreate(location, type)) {

              const maybeExists = await this.persist.findOneChannel({
                where: {
                  LocationId: id,
                  intent,
                  type
                },
                transaction: t,
                rejectOnEmpty: false
              })

              if(maybeExists) continue

              await this.persist.createChannel({
                type,
                intent,
                LocationId: id
              }, { transaction: t })
            }
          }
        } else {
          if(this.#shouldCreate(location, type)) {

            const maybeExists = await this.persist.findOneChannel({
              where: {
                LocationId: id,
                type
              },
              transaction: t,
              rejectOnEmpty: false
            })

            if(maybeExists) continue

            await this.persist.createChannel({
              type,
              LocationId: id
            }, { transaction: t })
          }

        }
      }
    })
  }

  async getAllChannels(payload = {}) {
    const {
      offset = 0,
      limit = 100,
      query
    } = payload

    return await this.withinTx(async (t) => {
      const where = this.sequelizeQuery(this.normalizeQuery(query, 'Channel'))

      const findAllOptions = {
        offset,
        limit,
        where,
        include: [{ association: 'Location' }],
        rejectOnEmpty: false,
        transaction: t
      }

      let channels = await this.persist.findAllChannels(findAllOptions)

      // If not found any channels, create the default ones:
      // Channel for importing in inventory with no location defined
      // Channel for exporting from inventory with no location defined
      //
      if(channels.length === 0) {
        channels = await this.persist.bulkCreateChannels([{
          type: 'inventory',
          intent: 'in'
        }, {
          type: 'inventory',
          intent: 'out'
        }, {type: 'production'}], {transaction: t})
      }

      return {
        data: channels.map((o) => o.toJSON()),
        count: channels.length
      }
    })
  }

  async linkDevice({ id, channel }) {
    this.log('Link device %s to channel %s', id, channel)

    this.validate({ id, channel }, LINK_DEVICE_SCHEMA)

    return await this.withinTx(async (t) => {
      const device = await this.persist.createDevice({ mid: id }, { transaction: t })

      await device.setChannel(channel, { transaction: t })

      const json = device.toJSON()

      this.emitDataEvent('device', 'linked', pick(json, ['mid']))

      return json
    })
  }

  async unlinkDevice({ id }) {
    this.log('Unlink device %s', id)

    this.validate({ id }, UNLINK_DEVICE_SCHEMA)

    return await this.withinTx(async (t) => {
      const device = head(await this.persist.findAllDevices({
        where: { mid: id },
        transaction: t
      }))

      await device.destroy({ transaction: t })

      this.emitDataEvent('device', 'unlinked', { mid: id })

      return { mid: id }
    })

  }

  async getActivatedDevices(payload = { query: {} }) {
    this.validate(payload, BaseControl.PAGED_ARGS_SCHEMA)

    const {
      offset = 0,
      limit = 100,
      query
    } = payload

    return await this.withinTx(async (t) => {
      const where = this.sequelizeQuery(this.normalizeQuery(query, 'Device'))

      let devices = await this.persist.findAllDevices({
        where,
        include: [{
          association: 'Channel',
          include: [{ association: 'Location' }]
        }],
        offset,
        limit,
        rejectOnEmpty: false,
        transaction: t
      })

      this.log('Found %j', devices)

      const data = devices.map((o) => o.toJSON())

      return {
        data,
        count: devices.length
      }
    })
  }

  async procData(payload) {
    this.validate(payload, PROC_DATA_PAYLOAD)

    const {
      id,
      data = ''
    } = payload

    return await this.withinTx(async (t) => {
      const handler = new DataHandler({ transaction: t, persist: this.persist })

      await handler.init({ id, data })

      if(handler.isProduction) {
        // settings
        const { job_bump_counter_cap } = this.settings

        // get jobs
        const { Op } =  this.persist

        const jobFindAll = {
          where: {
            barcode: data,
            rank: { [ Op.not ]: null },
            incident: null,
            PipelineId: null,
            PipelineStageId: { [ Op.not ]: null },
            status: { [ Op.in ]: [ 'started', 'working' ] }
          },
          transaction: t,
          rejectOnEmpty: false
        }

        const pipelineInclude = {
          association: 'Pipeline',
          required: true,
          include: [{
            association: 'Location',
            required: true,
            where: { id: handler.location_id }
          }]
        }

        const pipelineIncludeNoLocation = {
          association: 'Pipeline',
          required: true,
          where: {
            LocationId: null
          }
        }

        const finalPipelineInclude = []
        if(handler.hasLocation) {
          finalPipelineInclude.push(pipelineInclude)
        } else {
          finalPipelineInclude.push(pipelineIncludeNoLocation)
        }

        jobFindAll.include = [{
          association: 'PipelineStage',
          required: true,
          include: finalPipelineInclude
        }]

        const jobs = await this.persist.findAllPipelineJobs(jobFindAll)

        const job = head(jobs)

        if(!job) throw new Error('no related jobs found')

        const multi = get(job, 'dataValues.barcodeMulti', 1)

        const progressCounter = job.progressCounter + multi

        if(progressCounter > job.plannedQty && job_bump_counter_cap === true) {
          this.log('cannot exceed planned quantity')

          throw new Error('cannot exceed planned quantity')
        }

        await job.update({ progressCounter }, { transaction: t })

        const stage = await job.getPipelineStage({ transaction: t })

        if(stage.position === 2 && (job.progressCounter === job.plannedQty)) {
          const pipeline = await stage.getPipeline({ transaction: t })

          const stages = await pipeline.getStages({
            where: { position: { [ Op.eq ]: 3 } },
            transaction: t
          })

          await job.setPipelineStage(head(stages), { transaction: t })
        } else if(stage.position === 1) {
          const pipeline = await stage.getPipeline({ transaction: t })

          const stages = await pipeline.getStages({ where: { position: { [ Op.eq ]: 2 } }, transaction: t })

          await job.setPipelineStage(head(stages), { transaction: t })
        }

        const json = job.toJSON()

        this.emitDataEvent('job', 'updated', pick(json, ['id', 'name']))

        return json
      } else if(handler.isInventory) {
        let product
        let productCount = 1

        if(handler.hasPackage) {
          const products = await handler.package.getProducts({ transaction: t })
          product = head(products)
          productCount = get(product, 'PackageProduct.dataValues.count', 1)
        } else {
          product = handler.product
        }

        if(product) {
          const invHandler = new InventoryTxHandler({ transaction: t, persist: this.persist })
          const [, item] = await invHandler.createTx({
            productId: product.get('id'),
            locationId: handler.location_id,
            type: handler.intent,
            count: productCount
          })

          const json = {
            id: product.get('id'),
            location: handler.location_id,
            name: product.get('name'),
            count: item.get('count')
          }

          this.emitDataEvent('inventory', 'updated', json)

          return json
        }
      }

      throw new Error('not processed')
    })
  }

  #shouldCreate(location, type) {
    if(type === 'inventory') {
      if(location?.type !== 'warehouse') {
        return false
      }
    } else if(type === 'production') {
      if(location?.type !== 'shop-floor') {
        return false
      }
    }

    return true
  }
}

const LINK_DEVICE_SCHEMA = {
  type: 'object',
  properties: {
    id: {
      type: 'string'
    },
    channel: {
      oneOf: [
        { type: 'string' },
        { type: 'number' }
      ]
    }
  },
  required: [
    'id',
    'channel'
  ],
  additionalProperties: false
}

const UNLINK_DEVICE_SCHEMA = {
  type: 'object',
  properties: {
    id: {
      type: 'string'
    }
  },
  required: [ 'id' ],
  additionalProperties: false
}

const PROC_DATA_PAYLOAD = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
      description: 'Device machine id'
    },
    data: {
      type: 'string'
    }
  },
  additionalProperties: false
}
