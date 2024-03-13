// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { get } from 'lodash-es'
import { BaseControl } from '../BaseControl.mjs'
import { enums } from '@pickestry/defs'
import { InventoryTxHandler } from '../lib/InventoryTxHandler.mjs'


export class InventoryControl extends BaseControl {

  static NAME = 'inventory'

  async init() {
  }

  async createInventoryTx(payload) {
    this.validate(payload, CREATE_INVENTORY_TX_SCHEMA)

    return await this.withinTx(async (t) => {
      const handler = new InventoryTxHandler({ transaction: t, persist: this.persist })

      const [tx, item] = await handler.createTx(payload)

      const json = tx.toJSON()

      json.__item = item.toJSON()

      this.emitDataEvent('tx', 'created', { id: json.id, name: item.get('Product').get('name') })

      return json
    })
  }

  async getInventoryItems(payload = {
    page: 1,
    query: {}
  }) {
    this.validate(payload, BaseControl.PAGED_ARGS_SCHEMA)

    const { query } = payload

    const page = get(payload, 'page', 1)

    const offset = (page - 1) * 10

    const limit = 10

    return await this.withinTx(async (t) => {
      const findAllOptions = {
        offset,
        limit
      }

      const productName = get(query, 'product.includes')

      let productWhere = {}
      if(productName) {
        productWhere = this.sequelizeQuery({name: { 'includes' :  productName}})

        delete query.product
      }

      if(query) {
        findAllOptions.where = this.sequelizeQuery(this.normalizeQuery(query, 'InventoryItem'))
      }

      findAllOptions.include = [
        {
          association: 'Product',
          where: productWhere
        },
        { association: 'Location' }
      ]

      findAllOptions.order = [['updated_at', 'DESC']]

      findAllOptions.rejectOnEmpty = false

      findAllOptions.transaction = t

      const rows = await this.persist.findAllInventoryItems(findAllOptions)

      const count = await this.persist.countInventoryItems(findAllOptions)

      this.log('Found %s %s', count, 'InventoryItem')

      const data = rows.map((row) => row.toJSON())

      return { data, count }
    })
  }

}

const CREATE_INVENTORY_TX_SCHEMA = {
  type: 'object',
  properties: {
    product: {
      oneOf: [
        { type: 'string' },
        { type: 'number' }
      ]
    },
    location: {
      oneOf: [
        { type: 'string' },
        { type: 'number' },
        { type: 'null' }
      ]
    },
    type: {
      type: 'string',
      enum: enums.inventoryTxType
    },
    count: {
      type: 'number',
      multipleOf: 1
    }
  },
  required: [ 'type' ]
}
