// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { BaseHandler } from './BaseHandler.mjs'

export class InventoryTxHandler extends BaseHandler {

  constructor({ transaction, persist }) {
    super({ transaction, persist })
  }

  async createTx({
    product,
    location,
    type,
    count = 1
  }) {
    // create tx
    const tx = await this.persist.createInventoryTx({
      type,
      count,
      ProductId: product,
      LocationId: location
    }, { transaction: this.transaction })

    // create inventory item
    const where = {
      product_id: product,
      location_id: location ? location : null
    }

    const [item, created] = await this.persist.findOrCreateInventoryItem({
      where,
      transaction: this.transaction,
      rejectOnEmpty: false,
      include: [ { association: 'Product' } ],
      defaults: {
        ProductId: product,
        count: 0
      }
    })

    if(created) {
      item.setProduct(product, { transaction: this.transaction })
      item.setLocation(location, { transaction: this.transaction })
    }

    let countToAdd = 0
    switch(type) {
    case 'in':
    case 'out_negative':
      countToAdd = count
      break
    case 'out':
    case 'in_negative':
      countToAdd = -count
      break
    default:
      console.log('Not able to process type: ' + type) // eslint-disable-line no-console
    }

    await item.increment({ count: countToAdd}, { transaction: this.transaction })

    await item.reload({ transaction: this.transaction })

    return [tx, item]
  }

}
