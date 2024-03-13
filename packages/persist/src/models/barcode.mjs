// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { Model } from 'sequelize'

export default (sequelize, DataTypes) => {

  class Barcode extends Model {

    static associate(models) {
      models.Barcode.belongsTo(models.Product)
      models.Barcode.belongsTo(models.Package)
    }

  }

  Barcode.init({
    value: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Barcode',
    rejectOnEmpty: false,
    timestamps: false
  })

  return Barcode
}

