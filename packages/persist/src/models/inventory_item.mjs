// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { Model } from 'sequelize'

export default (sequelize, DataTypes) => {

  class InventoryItem extends Model {

    static associate(models) {
      models.InventoryItem.belongsTo(models.Location, {onDelete: 'RESTRICT'})
      models.InventoryItem.belongsTo(models.Product, {onDelete: 'RESTRICT'})
      models.InventoryItem.hasMany(models.InventoryTx, {as: 'txs'})
    }
  }

  InventoryItem.init({count: DataTypes.INTEGER}, {
    sequelize,
    modelName: 'InventoryItem'
  })

  return InventoryItem
}

