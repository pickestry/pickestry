// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { Model } from 'sequelize'

export default (sequelize, DataTypes, { enums }) => {

  class InventoryTx extends Model {

    static associate(models) {
      models.InventoryTx.belongsTo(models.Location, {onDelete: 'RESTRICT'})
      models.InventoryTx.belongsTo(models.Product, {onDelete: 'RESTRICT'})
    }
  }

  InventoryTx.init({
    type: {
      type: DataTypes.ENUM,
      values: enums.inventoryTxType
    },
    count: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'InventoryTx',
    updatedAt: false
  })

  return InventoryTx
}

