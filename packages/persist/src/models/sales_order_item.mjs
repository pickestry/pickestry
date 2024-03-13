// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { Model } from 'sequelize'

export default (sequelize, DataTypes, { enums }) => {

  class SalesOrderItem extends Model {

    static associate(models) {
      models.SalesOrderItem.belongsTo(models.SalesOrder)
      models.SalesOrderItem.belongsTo(models.Product)
    }

  }

  SalesOrderItem.init({
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
    modelName: 'SalesOrderItem',
    indexes: [{
      name: 'so_item_idx1',
      unique: true,
      fields: [
        'sales_order_id',
        'product_id'
      ]
    }]
  })

  return SalesOrderItem
}
