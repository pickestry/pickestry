// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { Model } from 'sequelize'

export default (sequelize, DataTypes, { enums }) => {

  class Location extends Model {

    static associate(models) {
      models.Location.hasMany(models.Channel, {
        as: 'channels',
        onDelete: 'CASCADE'
      })
    }

  }

  Location.init({
    name: DataTypes.STRING,
    address: DataTypes.TEXT,
    type: {
      type: DataTypes.ENUM(10),
      values: enums.locationTypes
    }
  }, {
    sequelize,
    modelName: 'Location',
  })

  return Location
}


