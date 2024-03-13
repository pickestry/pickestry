// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { Model } from 'sequelize'

export default (sequelize, DataTypes) => {

  class PackageProduct extends Model {

    static associate(models) { // eslint-disable-line no-unused-vars
    }

  }

  PackageProduct.init({count: DataTypes.INTEGER}, {
    sequelize,
    modelName: 'PackageProduct'
  })

  return PackageProduct
}

