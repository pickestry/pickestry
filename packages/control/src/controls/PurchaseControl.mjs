// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { omit } from 'lodash-es'
import { pick } from 'lodash-es'
import { get } from 'lodash-es'
import { isNil } from 'lodash-es'
import { enums } from '@pickestry/defs'
import { displayAmount } from '@pickestry/utils'
import { dates } from '@pickestry/utils'
import { BaseControl } from '../BaseControl.mjs'
import { BuyFactory } from '../lib/BuyFactory.mjs'
import { DocBuyOrder } from '../lib/DocBuyOrder.mjs'

export class PurchaseControl extends BaseControl {

  static NAME = 'purchase'

  async init() {
  }

  /**
   *
   */
  async createBuyOrder(payload) {
    this.validate(payload, CREATE_BUY_ORDER_SCHEMA)

    const {
      supplier,
      notes,
      shippingAddress,
      currency,
      items
    } = payload

    return await this.withinTx(async (t) => {
      const factory = new BuyFactory({
        transaction: t,
        persist: this.persist
      })

      await factory.createOrder({
        notes,
        shippingAddress,
        currency
      })

      await factory.withSupplier(supplier)

      await factory.addItems(items)

      const order = factory.getInstance()

      const json = order.toJSON()

      this.emitDataEvent('purchase_order', 'created', pick(json, ['id', 'refNum']))

      return json
    })
  }

  async updateBuyOrder(payload) {
    this.validate(payload, UPDATE_BUY_ORDER_SCHEMA)

    this.log('Attempt to update purchase order: %s', payload.id)

    const {
      id,
      notes = null,
      shippingAddress,
      status,
      items = []
    } = payload

    return await this.withinTx(async (t) => {
      const order = await this.persist.findPurchaseOrderByPk(id, {
        include: [{ association: 'items' }],
        transaction: t
      })

      const itemIds = items.map(({ id }) => id)

      const removeIds = []
      for(const p of order.items) {
        if(!itemIds.includes(p.id))
          removeIds.push(p.id)
      }

      if(removeIds.length !== 0) {
        await order.removeItems(removeIds, { transaction: t })
      }

      for(const item of items) {

        const through = Object.assign({}, omit(item, ['id']), { currency: order.get('currency')  })

        await order.addItem(item.id, {
          through,
          transaction: t
        })
      }

      // update rest
      await order.update({
        notes,
        status,
        shippingAddress
      }, {
        transaction: t,
        fields: [
          'notes',
          'status',
          'shippingAddress'
        ]
      })

      const json = order.toJSON()

      this.emitDataEvent('purchase_order', 'updated', pick(json, ['id', 'refNum']))

      return json
    })
  }

  async exportBuyOrder(payload) {
    this.validate(payload, EXPORT_BUY_ORDER_SCHEMA)

    this.log('Export buy order %s', payload.id)

    const {
      id,
      to = '-',
      toAddress = '-'
    } = payload

    return await this.withinTx(async () => {
      const order = await this.persist.findPurchaseOrderByPk(id, {
        include: [
          { association: 'Supplier' },
          { association: 'items' }
        ]
      })

      // pre-process
      const title = `Purchase Order ${order.get('refNum')}`

      const notes = order.get('notes')

      const items = get(order, 'items')

      const itemsJson = items.map((item) => {
        return {
          name: item.get('name'),
          amout: get(item, 'PurchaseOrderItem.dataValues.amount'),
          currency: get(item, 'PurchaseOrderItem.dataValues.currency'),
          qty: get(item, 'PurchaseOrderItem.dataValues.qty'),
          tax: get(item, 'PurchaseOrderItem.dataValues.tax'),
          total: get(item, 'PurchaseOrderItem.dataValues.total')
        }
      })

      const finalItems = itemsJson.map((item) => {
        const {
          name,
          amount: itemAmount,
          currency,
          qty: itemQty,
          unit,
          total: itemTotal
        } = item

        const amount = !isNil(itemAmount) ? displayAmount(itemAmount, currency) : ''

        const qty = `${itemQty} ${unit ? unit : ''}`

        const total = !isNil(itemTotal) ? displayAmount(itemTotal, currency) : ''

        return {
          name,
          amount,
          currency,
          qty,
          total
        }
      })

      const doc = new DocBuyOrder()

      doc.create({
        title,
        date: dates.displayWithTime(+new Date()),
        to,
        toAddress,
        notes,
        items: finalItems
      })

      const content = await doc.finalize()

      return {
        content,
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        name: 'purchase_order.docx'
      }
    })

  }
}

const CREATE_BUY_ORDER_SCHEMA = {
  type: 'object',
  properties: {
    supplier: {
      oneOf: [
        { type: 'string' },
        { type: 'number' }
      ]
    },
    notes: {
      oneOf: [
        { type: 'string' },
        { type: 'null' }
      ]
    },
    shippingAddress: {
      oneOf: [
        { type: 'string' },
        { type: 'null' }
      ]
    },
    currency: {
      type: 'string',
      description: 'Currency ISO'
    },
    status: {
      type: 'string',
      enum: enums.purchaseOrderStatus
    },
    items: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            oneOf: [
              { type: 'string' },
              { type: 'number' }
            ]
          },
          qty: {
            type: 'number'
          },
          amount: {
            type: 'number'
          },
          currency: {
            type: 'string'
          },
          tax: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                value: {
                  type: 'number'
                },
                name: {
                  type: 'string'
                }
              }
            }
          },
          total: {
            type: 'number'
          }
        },
        required: [
          'id',
          'currency'
        ],
        additionalProperties: false
      },
      minItems: 1,
      uniqueItems: true
    }
  },
  required: [
    'supplier',
    'currency',
    'items'
  ]
}

const UPDATE_BUY_ORDER_SCHEMA = {
  type: 'object',
  properties: {
    id: {
      oneOf: [
        { type: 'string' },
        { type: 'number' }
      ]
    },
    notes: {
      oneOf: [
        { type: 'string' },
        { type: 'null' }
      ]
    },
    shippingAddress: {
      oneOf: [
        { type: 'string' },
        { type: 'null' }
      ]
    },
    status: {
      type: 'string',
      enum: enums.purchaseOrderStatus
    },
    items: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: {
            oneOf: [
              { type: 'string' },
              { type: 'number' }
            ]
          },
          qty: {
            type: 'number'
          },
          amount: {
            type: 'number'
          },
          tax: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                value: {
                  type: 'number'
                },
                name: {
                  type: 'string'
                }
              }
            }
          },
          total: {
            type: 'number'
          }
        },
        required: [
          'id'
        ],
        additionalProperties: false
      },
      minItems: 1,
      uniqueItems: true
    }
  },
  required: [
    'id',
    'items'
  ]
}

const EXPORT_BUY_ORDER_SCHEMA = {
  type: 'object',
  properties: {
    id: {
      oneOf: [
        { type: 'string' },
        { type: 'number' }
      ],
      description: 'Order id'
    },
    to: {
      type: 'string',
      description: 'Company name to deliver order'
    },
    notes: {
      type: 'string'
    },
    toAddress: {
      type: 'string',
      description: 'Address to deliver to'
    }
  },
  additionalProperties: false,
  required: [ 'id' ]
}
