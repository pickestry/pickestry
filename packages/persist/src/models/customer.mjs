// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { Model } from 'sequelize'

export default (sequelize, DataTypes) => {

  class Customer extends Model {

    static associate(models) { // eslint-disable-line no-unused-vars
    }

  }

  Customer.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    address: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Customer'
  })

  return Customer
}
