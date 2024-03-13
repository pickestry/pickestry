// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import Debug from 'debug'

export class ReportBase {

  #generator

  #type

  #report

  #log

  constructor(generator, type) {
    this.#generator = generator
    this.#type = type

    this.#log = Debug('pickestry:control')
  }

  async generate() {
    throw new Error('not implemented')
  }

  async init() {
    const {
      name,
      query
    } = this.#generator

    this.#report = await this.getModel('Report').create({
      type: this.#type,
      name,
      query
    })
  }

  log(...params) {
    this.#log(...params)
  }

  get persist() {
    return this.#generator.persist
  }

  getModel(name) {
    return this.persist.getModel(name)
  }

  get query() {
    return this.#report.get('query')
  }

  getMeta(name) {
    return this.#generator.getMeta(name)
  }

  get reportId() {
    return this.#report.get('id')
  }

  get report() {
    return this.#report
  }

  get control() {
    return this.#generator.control
  }

  get settings() {
    return this.#generator.control.settings
  }

  get t() {
    return this.#generator.t
  }

}
