// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { Model } from 'sequelize'

export default (sequelize, DataTypes, { enums }) => {

  class PurchaseOrder extends Model {

    static associate(models) {
      models.PurchaseOrder.belongsTo(models.Supplier)
      models.PurchaseOrder.belongsToMany(models.Product, {
        through: models.PurchaseOrderItem,
        as: 'items'
      })
    }

  }

  PurchaseOrder.init({
    refNum: DataTypes.STRING,
    shippingAddress: DataTypes.TEXT,
    status: {
      type: DataTypes.ENUM,
      values: enums.purchaseOrderStatus,
      defaultValue: enums.purchaseOrderStatusDefault
    },
    notes: DataTypes.TEXT,
    currency: {
      type: DataTypes.ENUM,
      values: enums.currencyIso
    }
  }, {
    sequelize,
    modelName: 'PurchaseOrder'
  })

  return PurchaseOrder
}

