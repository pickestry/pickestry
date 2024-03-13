// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { Model } from 'sequelize'

export default (sequelize, DataTypes, { enums }) => {

  class PurchaseOrderItem extends Model {

    static associate(models) {
      models.PurchaseOrderItem.belongsTo(models.PurchaseOrder)
      models.PurchaseOrderItem.belongsTo(models.Product)
    }
  }

  PurchaseOrderItem.init({
    qty: DataTypes.INTEGER,
    amount: DataTypes.INTEGER,
    total: DataTypes.INTEGER,
    tax: DataTypes.JSON,
    currency: {
      type: DataTypes.ENUM,
      values: enums.currencyIso
    }
  }, {
    sequelize,
    modelName: 'PurchaseOrderItem',
    indexes: [
    {
      name: 'po_item_idx1',
      unique: true,
      fields: [
        'purchase_order_id',
        'product_id'
      ]
    }
    ]
  })

  return PurchaseOrderItem
}

