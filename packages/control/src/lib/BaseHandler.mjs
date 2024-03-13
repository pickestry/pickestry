// Part of Pickestry. See LICENSE file for full copyright and licensing details.

/**
 * An abstract class service handlers are based on
 *
 * @abstract
 */
export class BaseHandler {

  #transaction

  #persist

  constructor({
    transaction,
    persist
  }) {
    if(!persist) throw new Error('persistance layer required')

    this.#transaction = transaction
    this.#persist = persist
  }

  get transaction() {
    return this.#transaction
  }

  get persist() {
    return this.#persist
  }

  get models() {
    return this.persist.models
  }
}
