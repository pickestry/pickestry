// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { CounterType } from '@pickestry/core'
import { REF_MEDIUM_LENGTH } from '@pickestry/core'
import { REF_JOB_PREFIX } from '@pickestry/core'
import { head } from 'lodash-es'
import { get } from 'lodash-es'

export class JobFactory {

  #transaction

  #persist

  #job

  constructor({
    transaction,
    persist
  }) {
    if(!persist) throw new Error('persistance layer required')

    this.#transaction = transaction
    this.#persist = persist
  }

  async createJob({
      name,
      start,
      plannedQty = 1
    }) {

    const refNum = await this.#generateRefNum()

    this.#job = await this.models.PipelineJob.create({
      refNum,
      name,
      start,
      plannedQty,
      progressCounter: 0
    }, { transaction: this.#transaction })

    await this.#rankIt()
  }

  async withPackage(id) {
    const pkg = await this.models.Package.findByPk(id, {
      transaction: this.#transaction,
      include: [{ association: 'Barcode' }]
    })

    await this.#job.setPackage(pkg, { transaction: this.#transaction })

    const p = head(await pkg.getProducts())

    if(!this.#job.name) {
      await this.#job.update({name: `Making ${this.#job.plannedQty} ${p.name}`}, { transaction: this.#transaction })
    }

    const barcode = get(pkg, 'dataValues.Barcode.value')
    const itemCount = get(p, 'PackageProduct.dataValues.count', 1)
    const barcodeCount = Math.ceil(this.#job.plannedQty / itemCount)

    if(barcode) {
      await this.#job.update({
        barcode,
        barcodeCount,
        barcodeMulti: itemCount
      }, { transaction: this.#transaction })
    } else {
      await this.#job.update({ barcodeMulti: itemCount }, { transaction: this.#transaction })
    }

    await this.#job.setProduct(p, { transaction: this.#transaction })
  }

  async withProduct(id) {
    const p = await this.models.Product.findByPk(id, {
      transaction: this.#transaction,
      include: [{ association: 'Barcode' }],
      rejectOnEmpty: false
    })

    if(!p) throw new Error('product not found')

    const barcode = get(p, 'dataValues.Barcode.value')
    if(barcode) {
      await this.#job.update({ barcode }, { transaction: this.#transaction })
    }

    if(!this.#job.name) {
      this.#job.update({name: `Making ${this.#job.plannedQty} ${p.name}`}, { transaction: this.#transaction })
    }

    await this.#job.setProduct(p, { transaction: this.#transaction })
  }

  async withPipeline(id) {
    // create
    const pipeline = await this.persist.findEntityById({
      model: 'Pipeline',
      id,
      include: [{ association: 'stages' }]
    }, { transaction: this.#transaction })

    const firstStage = head(await pipeline.getStages({ transaction: this.#transaction }))

    await this.#job.setPipelineStage(firstStage, { transaction: this.#transaction })
  }

  getInstance() {
    return this.#job
  }

  async #generateRefNum() {
    const [modelCounter] = await this.models.Counter.findOrCreate({
      where: {type: CounterType.JOB},
      defaults: {
        type: CounterType.JOB,
        counter: 1
      },
      transaction: this.#transaction
    })

    await modelCounter.increment('counter', {transaction: this.#transaction})

    return REF_JOB_PREFIX + `${modelCounter.get('counter')}`.padStart(REF_MEDIUM_LENGTH, '0')
  }

  async #rankIt() {
    const { not } = this.persist.Op

    const findAllProps = {
      where: {rank: {[not]: null}},
      limit: 1,
      order: [['rank', 'DESC']],
      rejectOnEmpty: false,
      transaction: this.#transaction
    }

    const lastJob = head(await this.models.PipelineJob.findAll(findAllProps))

    const nextRank = (lastJob?.get('rank') || 0) + 1

    this.#job.update({rank: nextRank}, { transaction: this.#transaction })
  }

  get models() {
    return this.persist.models
  }

  get persist() {
    return this.#persist
  }
}
