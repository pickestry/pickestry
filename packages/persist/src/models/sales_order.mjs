// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { Model } from 'sequelize'
import { orderCalculator } from '@pickestry/utils'

export default (sequelize, DataTypes, { enums }) => {

  class SalesOrder extends Model {

    static associate(models) {
      models.SalesOrder.belongsTo(models.Customer)
      models.SalesOrder.belongsToMany(models.Product, {
        through: models.SalesOrderItem,
        as: 'items'
      })
    }
  }

  SalesOrder.init({
    refNum: DataTypes.STRING,
    shippingAddress: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM,
      values: enums.salesOrderStatus,
      defaultValue: enums.salesOrderStatusDefault
    },
    notes: DataTypes.STRING,
    currency: {
      type: DataTypes.ENUM,
      values: enums.currencyIso
    },
    discounts: DataTypes.JSON,
    shipping: DataTypes.JSON,
    net: {
      type: DataTypes.VIRTUAL,
      get() {
        const items = this.getDataValue('items') || []
        const finalItems = items.map((o) => o.getDataValue('SalesOrderItem')?.toJSON())

        return orderCalculator.calculateNet(finalItems)
      }
    },
    tax: {
      type: DataTypes.VIRTUAL,
      get() {
        const items = this.getDataValue('items') || []
        const finalItems = items.map((o) => o.getDataValue('SalesOrderItem')?.toJSON())

        return orderCalculator.calculateTax(finalItems)
      }
    },
    gross: {
      type: DataTypes.VIRTUAL,
      get() {
        const items = this.getDataValue('items') || []
        const finalItems = items.map((o) => o.getDataValue('SalesOrderItem')?.toJSON())

        const totals = orderCalculator.calculateTotals(finalItems)

        return totals ? (totals.gross || 0) : 0
      }
    }
  }, {
    sequelize,
    modelName: 'SalesOrder'
  })

  return SalesOrder
}

