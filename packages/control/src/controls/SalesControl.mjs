// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { omit } from 'lodash-es'
import { pick } from 'lodash-es'
import { get } from 'lodash-es'
import { isNil } from 'lodash-es'
import { enums } from '@pickestry/defs'
import { options } from '@pickestry/defs'
import { displayAmount } from '@pickestry/utils'
import { dates } from '@pickestry/utils'
import { orderCalculator } from '@pickestry/utils'
import { BaseControl } from '../BaseControl.mjs'
import { SellFactory } from '../lib/SellFactory.mjs'
import { PDFSellOrder } from '../lib/PDFSellOrder.mjs'

export class SalesControl extends BaseControl {

  static NAME = 'sales'

  async init() {
  }

  async createSalesOrder(payload) {
    this.validate(payload, CREATE_SALES_ORDER_SCHEMA)

    const {
      customer,
      notes,
      shippingAddress,
      currency,
      items = [],
      discounts,
      shipping
    } = payload

    return await this.withinTx(async (t) => {
      const factory = new SellFactory({
        transaction: t,
        persist: this.persist
      })

      await factory.createOrder({
        shippingAddress,
        notes,
        currency,
        discounts,
        shipping
      })

      await factory.withCustomer(customer)

      await factory.addItems(items)

      const order = factory.getInstance()

      const json = order.toJSON()

      this.emitDataEvent('sales_order', 'created', pick(json, ['id', 'refNum']))

      return json
    })
  }

  async updateSalesOrder(payload) {
    this.validate(payload, UPDATE_SALES_ORDER_SCHEMA)

    const {
      id,
      notes = null,
      shippingAddress,
      status,
      items = [],
      discounts,
      shipping
    } = payload

    return await this.withinTx(async (t) => {
      const order = await this.persist.findSalesOrderByPk(id, {
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
        shippingAddress,
        discounts,
        shipping
      }, {
        transaction: t,
        fields: [
          'notes',
          'status',
          'shippingAddress',
          'discounts',
          'shipping'
        ]
      })

      const json = order.toJSON()

      this.emitDataEvent('sales_order', 'updated', pick(json, ['id', 'refNum']))

      return json
    })
  }

  /**
   * payload.id          Sales order id
   * payload.from        Company's name
   * payload.fromAddress Company's address
   */
  async createPDFSalesOrder(payload) {
    this.validate(payload, CREATE_PDF_SALES_ORDER_SCHEMA)

    const {
      id,
      from = '-',
      fromAddress = '-'
    } = payload

    return await this.withinTx(async () => {
      const order = await this.persist.findSalesOrderByPk(id, {
        include: [
          { association: 'Customer' },
          { association: 'items' }
        ]
      })

      // pre-process
      const title = `Sales Order ${order.get('refNum')}`

      const items = get(order, 'items')

      const currency = order.get('currency')

      const discounts = order.get('discounts') ?? []

      const shipping = order.get('shipping')

      const itemsJson = items.map((item) => {
        return {
          name: item.get('name'),
          amount: get(item, 'SalesOrderItem.dataValues.amount'),
          qty: get(item, 'SalesOrderItem.dataValues.qty'),
          tax: get(item, 'SalesOrderItem.dataValues.tax'),
          total: get(item, 'SalesOrderItem.dataValues.total')
        }
      })

      const finalItems = itemsJson.map((item) => {
        const {
          name,
          amount: itemAmount,
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
          qty,
          total
        }
      })

      const totals = orderCalculator.calculateTotals(itemsJson)

      const {
        net: netValue,
        tax: taxValue,
        gross: grossValue
      } = totals

      const net = displayAmount(netValue, currency)

      const tax = displayAmount(taxValue, currency)

      const gross = displayAmount(grossValue, currency)

      const pdf = new PDFSellOrder()

      const finalDiscounts = discounts.map((d) => {
        return {
          name: d.name,
          value: orderCalculator.displayDiscountAmount(d)
        }
      })

      let finalShipping
      if(!isNil(shipping)) {
        finalShipping = {
          name: shipping.name,
          value: displayAmount(shipping.amount, currency)
        }
      }

      const final = orderCalculator.calculateFinal(totals, discounts, shipping)

      const finalFinal = (final !== 0 && final !== grossValue) && displayAmount(final, currency)

      pdf.create({
        title,
        from,
        date: dates.displayWithTime(+new Date()),
        fromAddress,
        to: get(order, 'dataValues.Customer.name'),
        toAddress: order.get('shippingAddress'),
        items: finalItems,
        net,
        tax,
        gross,
        discounts: finalDiscounts,
        shipping: finalShipping,
        final: finalFinal
      })

      const blob = await pdf.finalize()

      const content = await blob.arrayBuffer()

      return {
        content,
        name: 'sales_order.pdf',
        type: 'application/pdf'
      }
    })
  }
}

const CREATE_SALES_ORDER_SCHEMA = {
  type: 'object',
  properties: {
    customer: {
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
        required: [ 'id' ],
        additionalProperties: false
      },
      minItems: 1,
      uniqueItems: true
    },
    discounts: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: options.discount.map(({value}) => value)
          },
          name: {
            type: 'string'
          },
          amount: {
            type: 'number'
          },
          currency: {
            type: 'string'
          }
        }
      }
    }
  },
  required: [
    'customer',
    'currency',
    'items'
  ]
}

const UPDATE_SALES_ORDER_SCHEMA = {
  type: 'object',
  properties: {
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
      enum: enums.salesOrderStatus
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
        required: [ 'id' ],
        additionalProperties: false
      },
      minItems: 1,
      uniqueItems: true
    },
    discounts: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            enum: options.discount.map(({value}) => value)
          },
          name: {
            type: 'string'
          },
          amount: {
            type: 'number'
          },
          currency: {
            type: 'string'
          }
        }
      }
    }
  },
  required: [ 'items' ]
}

const CREATE_PDF_SALES_ORDER_SCHEMA = {
  type: 'object',
  properties: {
    id: {
      oneOf: [
        { type: 'string' },
        { type: 'number' }
      ],
      description: 'Sales order id'
    },
    from: {
      type: 'string',
      description: 'Acount name',
    },
    fromAddress: {
      type: 'string',
      description: 'Account address'
    }
  },
  required: [ 'id' ]
}
