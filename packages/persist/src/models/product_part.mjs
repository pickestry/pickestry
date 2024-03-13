// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { Model } from 'sequelize'

export default (sequelize, DataTypes) => {

  class ProductPart extends Model {
    static associate(models) { // eslint-disable-line no-unused-vars
    }
  }

  ProductPart.init({qty: DataTypes.INTEGER}, {
    sequelize,
    modelName: 'ProductPart'
  })

  return ProductPart
}

