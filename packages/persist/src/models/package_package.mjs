// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { Model } from 'sequelize'

export default (sequelize, DataTypes) => {

  class PackagePackage extends Model {
    static associate(models) { // eslint-disable-line no-unused-vars
    }
  }

  PackagePackage.init({count: DataTypes.INTEGER}, {
    sequelize,
    modelName: 'PackagePackage'
  })

  return PackagePackage
}

