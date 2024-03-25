// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import EventEmitter from 'node:events'
import Debug from 'debug'
import { schema } from '@pickestry/defs'
import { createPersist } from '@pickestry/persist'
import { isFunction } from 'lodash-es'
import PQueue from 'p-queue'
import { produce } from 'immer'
import { head } from 'lodash-es'
import { isArray } from 'lodash-es'

const log = Debug('pickestry:control')

const IGNORE = [
  'constructor',
  'init'
]

export class Control extends EventEmitter {

  #initialized = false

  #persist

  #queue

  #settings

  #log = log

  constructor() {
    super()

    this.log = this.log.bind(this)
    this.init = this.init.bind(this)
    this.setSettings = this.setSettings.bind(this)

    this.#queue = new PQueue({ concurrency: 1 })

    this.withinTx = this.withinTx.bind(this)

    this.onQueueActive = this.onQueueError.bind(this)
    this.#queue.on('error', this.onQueueError)
  }

  async init({
    controls = [],
    dataDir,
    dataLogging,
    settings = {}
  } = {}) {
    if (this.#initialized) return

    try {
      this.#persist = await createPersist({
        dataDir,
        dataLogging
      })
    } catch(err) {
      log('Failed to initialize persist: ', err)
      throw new Error('failed to initialize persist: ', err)
    }

    for(const ControlClass of controls) {
      await this.registerControl(ControlClass)
    }

    this.#settings = settings

    this.#initialized = true

    log('controls loaded!')
  }

  async registerControl(ControlClass) {
    const name = ControlClass.NAME

    if(!name) throw new Error('cannot register control without a name')

    for(const prop of Object.getOwnPropertyNames(ControlClass.prototype)) {
      if(IGNORE.includes(prop)) continue

      const i = new ControlClass(this)

      if(this[prop]) {
        throw new Error('Duplicate function found: ' + prop)
      }

      this[prop] = i[prop].bind(i)

      if(isFunction(i['init'])) {
        await i.init()
      }

      log(`Succesfully registered \`${prop}\` control`)
    }
  }

  sequelizeQuery(q) {
    return this.persist.convert(q)
  }

  async seed() {
    return await this.persist.seed()
  }

  setSettings(settings) {
    this.#settings = settings
  }

  normalizeQuery(q = {}, model) {
    return produce(q, (draft) => {
      for(const [k, v] of Object.entries(draft)) {
        const fieldPath = schema.getPath(model, k)
        if(fieldPath != k) {
          draft[fieldPath] = v
          delete draft[k]
        }

        const [op, value] = head(Object.entries(v))

        if(schema.filterIsEntity(model, k) && isArray(value)) {
          draft[fieldPath] = { [op]: value.map((o) => o.id) }
        }
      }
    })
  }

  emitDataEvent(model, action, entity) {
    this.emit('persist', {
      name: `${model.toLowerCase()}.${action}`,
      entity
    })
  }

  onQueueError(error) {
    log('[QUEUE] Failed: %s', error.message)

    this.emit('queue_error', {
      name: error.name,
      message: error.message
    })
  }

  log(...params) {
    this.#log(...params)
  }

  async withinTx(cb) {
    return await this.#queue.add(async () => await this.persist.withinTx(cb))
  }

  async cleanup() {
    this.#queue.off('error', this.onQueueError)

    await this.persist.close()
  }

  async __dangerous__resetAll() {
    await this.persist.__dangerous__resetAll()
  }

  get persist() {
    return this.#persist
  }

  get initialized() {
    return this.#initialized
  }

  get settings() {
    return this.#settings
  }
}

export const control = new Control()
