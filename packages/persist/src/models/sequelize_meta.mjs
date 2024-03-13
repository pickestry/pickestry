// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { Model } from 'sequelize'

export default (sequelize, DataTypes) => {

  class SequelizeMeta extends Model {

    static associate(models) { // eslint-disable-line no-unused-vars
    }

  }

  SequelizeMeta.init({name: DataTypes.STRING}, {
    sequelize,
    modelName: 'SequelizeMeta',
    rejectOnEmpty: false
  })

  return SequelizeMeta
}

