// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import oeprationsJson from './operations.json'

class Operations {

  #options

  constructor(options) {
    this.#options = options
  }

  getOperation(name) {
    return this.#options.find(({value}) => value == name)
  }

  getShort(name) {
    return this.getOperation(name)?.short || ''
  }
}

export const operations = new Operations(oeprationsJson.operations)
