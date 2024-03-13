// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import Ajv from 'ajv'
import { SchemaError } from './SchemaError.mjs'
import Debug from 'debug'

/*
 * Abstract class for controls
 */
export class BaseControl {

  #control

  #ajv

  #log

  constructor(control) {
    this.#control = control
    this.#ajv = new Ajv()
    this.#log = Debug('pickestry:control')

    this.withinTx = this.withinTx.bind(this)
    this.sequelizeQuery = this.sequelizeQuery.bind(this)
    this.normalizeQuery = this.normalizeQuery.bind(this)
  }

  validate(data, schema = BaseControl.ID_SCHEMA) {
    let valid = this.#ajv.validate(schema, data)

    const source = (new Error()).stack.split('\n')[2].trim().split(' ')[1]

    this.log('AJV Errors: %s -> %O, %O', source, this.#ajv.errors, data)
    if(this.#ajv.errors) {
      console.log('WARNING: AJV Errors:' + source + ' => ' + JSON.stringify(this.#ajv.errors, null, 2)) // eslint-disable-line no-console
    }

    if(!valid) throw new SchemaError(this.#ajv.errors)

    return valid
  }

  async withinTx(cb) {
    return await this.#control.withinTx(cb)
  }

  newQuery(offset = 0, limit = 10) {
    return this.#control.newQuery(offset, limit)
  }

  sequelizeQuery(...params) {
    return this.#control.sequelizeQuery(...params)
  }

  normalizeQuery(...params) {
    return this.#control.normalizeQuery(...params)
  }

  emitDataEvent(...params) {
    this.#control.emitDataEvent(...params)
  }

  log(...params) {
    this.#log(...params)
  }

  get control() {
    return this.#control
  }

  get persist() {
    return this.control.persist
  }

  get settings() {
    return this.control.settings
  }

  static ID_SCHEMA = {
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

  static PAGED_ARGS_SCHEMA = {
    type: 'object',
    properties: {
      page: {
        type: 'number'
      },
      query: {
        type: 'object'
      },
      order: {
        type: 'array'
      }
    },
    additionalProperties: false
  }
}
