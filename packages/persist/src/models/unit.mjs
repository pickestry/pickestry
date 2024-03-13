// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { Model } from 'sequelize'

export default (sequelize, DataTypes) => {

  class Unit extends Model {

    static associate(models) { // eslint-disable-line no-unused-vars
    }
  }

  Unit.init({
    name: DataTypes.STRING,
    short: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Unit',
  })

  return Unit
}
