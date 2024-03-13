// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { Model } from 'sequelize'

export default (sequelize, DataTypes) => {

  class Supplier extends Model {

    static associate(models) { // eslint-disable-line no-unused-vars
    }

  }

  Supplier.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Supplier'
  })

  return Supplier
}
