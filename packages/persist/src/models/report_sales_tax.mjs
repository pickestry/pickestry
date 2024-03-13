// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { Model } from 'sequelize'

export default (sequelize, DataTypes, { enums }) => {

  class ReportSalesTax extends Model {

    static associate(models) {
      models.ReportSalesTax.belongsTo(models.Report)
      models.ReportSalesTax.belongsTo(models.SalesOrder)
    }
  }

  ReportSalesTax.init({
    tax: DataTypes.JSON,
    running: DataTypes.INTEGER,
    currency: {
      type: DataTypes.ENUM,
      values: enums.currencyIso
    },
    createdAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'ReportSalesTax',
    timestamps: false
  })

  return ReportSalesTax
}
