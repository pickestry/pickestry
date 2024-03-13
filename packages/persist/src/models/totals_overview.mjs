// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { Model } from 'sequelize'

export default (sequelize, DataTypes, { enums }) => {

  class TotalsOverview extends Model {

    static associate(models) { // eslint-disable-line no-unused-vars
    }

  }

  TotalsOverview.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    name: DataTypes.STRING,
    onHand: DataTypes.INTEGER,
    planned: DataTypes.INTEGER,
    ready: DataTypes.INTEGER,
    receiving: DataTypes.INTEGER,
    selling: DataTypes.INTEGER,
    unit: {
      type: DataTypes.ENUM,
      values: enums.units
    }
  }, {
    sequelize,
    modelName: 'TotalsOverview',
    tableName: 'totals_overview',
    timestamps: false
  })

  return TotalsOverview
}
