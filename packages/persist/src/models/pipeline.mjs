// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { Model } from 'sequelize'

export default (sequelize, DataTypes) => {

  class Pipeline extends Model {

    static associate(models) {
      models.Pipeline.hasMany(models.PipelineStage, {
        as: 'stages',
        onDelete: 'CASCADE'
      })
      models.Pipeline.hasMany(models.PipelineJob, {as: 'jobs'})
      models.Pipeline.belongsTo(models.Location)
    }
  }

  Pipeline.init({name: DataTypes.STRING}, {
    sequelize,
    modelName: 'Pipeline',
  })

  return Pipeline
}
