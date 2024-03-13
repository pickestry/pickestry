// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { CounterType } from '@pickestry/core'
import { REF_MEDIUM_LENGTH } from '@pickestry/core'
import { REF_SALES_ORDER_PREFIX } from '@pickestry/core'
import { omit } from 'lodash-es'

export class SellFactory {

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
      currency,
      shippingAddress,
      discounts,
      shipping
    }) {
    const refNum = await this.#generateRefNum()

    this.#order = await this.persist.createSalesOrder({
      refNum,
      notes,
      shippingAddress,
      currency,
      discounts,
      shipping
    }, { transaction: this.#transaction })
  }

  async withCustomer(id) {
    const customer = await this.persist.findCustomerByPk(id, { transaction: this.#transaction })

    await this.#order.setCustomer(customer, { transaction: this.#transaction })
  }

  /**
   * @param {Object[]} items array of items
   * @param {number} items[].id
   * @param {number} items[].qty
   * @param {number} items[].amount
   * @param {number} items[].total
   * @param {array}  items[].tax
   * @param {number} items[].tax[].value
   * @param {string} items[].tax[].name
   */
  async addItems(items = []) {
    for(const item of items) {
      const through = Object.assign({}, omit(item, ['id']), { currency: this.#order.get('currency') })

      await this.#order.addItem(item.id, {
        through,
        transaction: this.#transaction
      })
    }
  }

  getInstance() {
    return this.#order
  }

  async #generateRefNum() {
    const [modelCounter] = await this.persist.findOrCreateCounter({
      where: { type: CounterType.SO },
      defaults: {
        type: CounterType.SO,
        counter: 1
      },
      transaction: this.#transaction
    })

    await modelCounter.increment('counter', { transaction: this.#transaction })

    return REF_SALES_ORDER_PREFIX + `${modelCounter.get('counter')}`.padStart(REF_MEDIUM_LENGTH, '0')
  }

  get persist() {
    return this.#persist
  }
}
