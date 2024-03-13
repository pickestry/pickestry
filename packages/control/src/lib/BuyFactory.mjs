// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { CounterType } from '@pickestry/core'
import { REF_MEDIUM_LENGTH } from '@pickestry/core'
import { REF_PURCHASE_ORDER_PREFIX } from '@pickestry/core'
import { omit } from 'lodash-es'

export class BuyFactory {

  #transaction

  #persist

  #order

  constructor({
    transaction,
    persist
  }) {
    if(!persist) throw new Error('persistance layer required')

    this.#transaction = transaction
    this.#persist = persist
  }

  async createOrder({
      notes,
      shippingAddress,
      currency
    }) {
    const refNum = await this.#generateRefNum()

    this.#order = await this.persist.createPurchaseOrder({
      refNum,
      notes,
      shippingAddress,
      currency
    }, { transaction: this.#transaction })
  }

  async withSupplier(id) {
    const supplier = await this.persist.findSupplierByPk(id, { transaction: this.#transaction })

    await this.#order.setSupplier(supplier, { transaction: this.#transaction })
  }

  /**
   * @param {Object[]} items array of items
   * @param {number} items[].id
   * @param {number} items[].qty
   * @param {number} items[].amount
   * @param {number} items[].currency
   * @param {number} items[].total
   * @param {array} items[].tax
   * @param {number} items[].tax[].value
   * @param {string} items[].tax[].name
   */
  async addItems(items = []) {
    for(const item of items) {
      await this.#order.addItem(item.id, {
        through: omit(item, ['id']),
        transaction: this.#transaction
      })
    }
  }

  getInstance() {
    return this.#order
  }

  async #generateRefNum() {
    const [modelCounter] = await this.persist.findOrCreateCounter({
      where: { type: CounterType.PO },
      defaults: {
        type: CounterType.PO,
        counter: 1
      },
      transaction: this.#transaction
    })

    await modelCounter.increment('counter', { transaction: this.#transaction })

    return REF_PURCHASE_ORDER_PREFIX + `${modelCounter.get('counter')}`.padStart(REF_MEDIUM_LENGTH, '0')
  }

  get persist() {
    return this.#persist
  }
}
