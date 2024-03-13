// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { reportTypes } from '@pickestry/defs'
import { get } from 'lodash-es'
import { SalesTax } from './reports/SalesTax.mjs'

export class ReportGenerator {

  #type

  #name

  #query

  #meta

  #control

  #persist

  #transaction

  #reportImpl = new Map()

  constructor({
    transaction,
    control
  }) {
    if(!control) throw new Error('control layer required')

    this.#transaction = transaction
    this.#persist = control.persist
    this.#control = control

    this.#reportImpl.set('sales-tax', new SalesTax(this))
  }

  start(type, meta = {}) {
    if(!reportTypes.includes(type)) {
      throw new Error(`unsupported report \`${type}\``)
    }

    this.#type = type
    this.#meta = meta

    return this
  }

  setQuery(query) {
    this.#query = query

    return this
  }

  setName(name) {
    this.#name = name

    return this
  }

  getMeta(name) {
    return get(this.#meta, name)
  }

  async generate() {
    if(!this.#type) throw new Error('type required')

    const impl = this.#getImpl(this.#type)

    await impl.init()

    return await impl.generate()
  }

  get name() {
    return this.#name
  }

  get query() {
    return this.#query
  }

  get t() {
    return this.#transaction
  }

  get persist() {
    return this.#persist
  }

  get control() {
    return this.#control
  }

  get settings() {
    return this.#control.settings
  }

  #getImpl(type) {
    if(!this.#reportImpl.has(type)) throw new Error('unsupported type')

    return this.#reportImpl.get(type)
  }
}
