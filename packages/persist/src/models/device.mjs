// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { Model } from 'sequelize'

export default (sequelize, DataTypes) => {

  class Device extends Model {

    static associate(models) {
      models.Device.belongsTo(models.Channel, { onDelete: 'RESTRICT' })
    }

  }

  Device.init({
    mid: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Device',
    timestamps: false
  })

  return Device
}

