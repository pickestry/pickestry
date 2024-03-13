// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { Model } from 'sequelize'

export default (sequelize, DataTypes) => {

  class Package extends Model {

    static associate(models) {
      models.Package.belongsToMany(models.Product, {
        through: models.PackageProduct,
        as: 'products'
      })
      models.Package.hasMany(models.PipelineJob, { onDelete: 'CASCADE' })
      models.Package.hasOne(models.Barcode)
    }
  }

  Package.init({name: DataTypes.STRING}, {
    sequelize,
    modelName: 'Package'
  })

  return Package
}

