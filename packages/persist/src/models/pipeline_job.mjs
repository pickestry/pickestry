// Part of Pickestry. See LICENSE file for full copyright and licensing details.

import { Model } from 'sequelize'

export default (sequelize, DataTypes, { enums }) => {

  class PipelineJob extends Model {

    static associate(models) {
      models.PipelineJob.belongsTo(models.PipelineStage, {onDelete: 'RESTRICT'})
      models.PipelineJob.belongsTo(models.Package)
      models.PipelineJob.belongsTo(models.Product)
      models.PipelineJob.belongsTo(models.Pipeline)
    }

    static setupHooks(models) {
      models.PipelineJob.addHook('beforeUpdate', async (instance, options) => {
        options.fields.push('status')

        const stage = await instance.getPipelineStage({ transaction: options.transaction })

        const maybeStagePosition = stage?.position

        let status = instance.get('status') || 'created'
        if(instance.incident === true) {
          status = 'incident'
        } else if(maybeStagePosition === 1) {
          status = 'started'
        } else if(maybeStagePosition === 2) {
          status = 'working'
        } else if(maybeStagePosition === 3) {
          status = 'done'
        }

        instance.dataValues.status = status
      })
    }
  }

  PipelineJob.init({
    name: DataTypes.INTEGER,
    rank: DataTypes.INTEGER,
    refNum: DataTypes.STRING,
    incident: DataTypes.BOOLEAN,
    incidentNote: DataTypes.TEXT,
    incidentDate: DataTypes.DATE,
    progressCounter: DataTypes.INTEGER,
    plannedQty: DataTypes.INTEGER,
    start: DataTypes.DATE,
    notes: DataTypes.TEXT,
    barcode: DataTypes.TEXT,
    barcodeCount: DataTypes.INTEGER,
    barcodeMulti: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    },
    status: {
      type: DataTypes.ENUM,
      values: enums.jobStatus,
      defaultValue: enums.jobStatus[0]
    }
  }, {
    sequelize,
    modelName: 'PipelineJob',
    indexes: [
      {
        name: 'pj_idx1',
        unique: false,
        fields: [ 'rank' ]
      },
      {
        name: 'pj_idx2',
        unique: false,
        fields: [ 'ref_num' ]
      }
    ]
  })


  return PipelineJob
}
