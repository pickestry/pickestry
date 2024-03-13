// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { Model } from 'sequelize'
import { set } from 'lodash-es'

export default (sequelize, DataTypes, { enums }) => {

  class Report extends Model {

    static associate(models) { // eslint-disable-line no-unused-vars
    }

    addMeta(name, value) {
      const meta = this.get('meta') || {}
      set(meta, name, value)
      this.set('meta', meta)
    }

    queryHas(name) {
      const query = this.get('query')

      return Object.keys(query).includes(name)
    }
  }

  Report.init({
    name: DataTypes.STRING,
    type: {
      type: DataTypes.ENUM,
      values: enums.reportTypes
    },
    query: DataTypes.JSON,
    meta: DataTypes.JSON
  }, {
    sequelize,
    modelName: 'Report',
    updatedAt: false
  })

  return Report
}
