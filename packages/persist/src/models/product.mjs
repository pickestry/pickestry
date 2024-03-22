// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { Model } from 'sequelize'

export default (sequelize, DataTypes, { enums }) => {

  class Product extends Model {

    static associate(models) {
      models.Product.belongsToMany(models.Package, {
        through: models.PackageProduct,
        as: 'packages'
      })
      models.Product.hasMany(models.Product, {foreignKey: 'ParentProductId'})
      models.Product.belongsToMany(models.Product, {
        through: models.ProductPart,
        as: 'parts'
      })
      models.Product.hasOne(models.Barcode)
    }

    static buildName(productName, options = []) {
      return `${productName ? productName + ' - ' : ''}${Object.values(options).join('/')}`
    }

  }

  Product.init({
    name: DataTypes.STRING,
    sku: DataTypes.STRING,
    canBeSold: DataTypes.BOOLEAN,
    price: DataTypes.INTEGER,
    canBeBought: DataTypes.BOOLEAN,
    cost: DataTypes.INTEGER,
    currency: {
      type: DataTypes.ENUM,
      values: enums.currencyIso
    },
    options: DataTypes.JSON,
    variant: DataTypes.JSON,
    productPicture: DataTypes.TEXT,
    isVariant: {
      type: DataTypes.VIRTUAL,
      get() {
        return this.variant && this.variant !== {}
      }
    },
    unit: {
      type: DataTypes.ENUM,
      values: enums.units
    }
  }, {
    sequelize,
    modelName: 'Product'
  })

  return Product
}

