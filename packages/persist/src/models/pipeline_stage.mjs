// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { Model } from 'sequelize'

export default (sequelize, DataTypes) => {

  class PipelineStage extends Model {

    static associate(models) {
      models.PipelineStage.belongsTo(models.Pipeline)
      models.PipelineStage.hasMany(models.PipelineJob, {
        as: 'jobs',
        onDelete: 'CASCADE'
      })
    }
  }

  PipelineStage.init({
    name: DataTypes.INTEGER,
    position: DataTypes.SMALLINT
  }, {
    sequelize,
    modelName: 'PipelineStage'
  })

  return PipelineStage
}

