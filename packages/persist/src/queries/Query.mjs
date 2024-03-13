// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import Debug from 'debug'

export class Query {

  #sequelize

  #log

  constructor(sequelize) {
    this.#sequelize = sequelize
    this.#log = Debug('pickestry:persist')
  }

  run() {
    throw new Error('need to implement')
  }

  get sequelize() {
    return this.#sequelize
  }

  log(...params) {
    this.#log(...params)
  }
}
