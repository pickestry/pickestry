// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { Model } from 'sequelize'

export default (sequelize, DataTypes, { enums }) => {

  class Channel extends Model {

    static associate(models) {
      models.Channel.belongsTo(models.Location, {onDelete: 'CASCADE'})
      models.Channel.hasMany(models.Device, {
        as: 'devices',
        onDelete: 'RESTRICT'
      })
    }

  }

  Channel.init({
    type: {
      type: DataTypes.ENUM(10),
      values: enums.channelTypes
    },
    intent: {
      type: DataTypes.ENUM(10),
      values: enums.scanIntent
    },
    name: {
      type: DataTypes.VIRTUAL,
      get() {
        let v = this.type

        const maybeName = this.Location?.get('name')
        if(maybeName) {
          v += ' / ' + maybeName
        }

        if(this.intent) {
          v += ' / ' + this.intent
        }

        return v
      }
    }
  }, {
    sequelize,
    modelName: 'Channel',
    timestamps: false
  })

  return Channel
}

