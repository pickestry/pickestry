// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { Model } from 'sequelize'

export default (sequelize, DataTypes) => {

  class SeederMeta extends Model {

    static associate(models) { // eslint-disable-line no-unused-vars
    }

  }

  SeederMeta.init({name: DataTypes.STRING}, {
    sequelize,
    modelName: 'SeederMeta',
    rejectOnEmpty: false
  })

  return SeederMeta
}

