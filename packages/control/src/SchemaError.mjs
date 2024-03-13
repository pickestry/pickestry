// Part of Pickestry. See LICENSE file for full copyright and licensing details.

export class SchemaError extends Error {

  #details

  constructor(details = {}, ...params) {
    super(...params)

    if(Error.captureStackTrace) {
      Error.captureStackTrace(this, SchemaError)
    }

    this.name = 'SchemaError'

    this.#details = details
  }

  get details() {
      return this.#details
  }
}
