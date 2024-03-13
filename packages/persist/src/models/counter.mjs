import { Model } from 'sequelize'

export default (sequelize, DataTypes) => {

  class Counter extends Model {
    static associate(models) { // eslint-disable-line no-unused-vars
    }
  }

  Counter.init({
    type: DataTypes.STRING(10),
    counter: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Counter',
    rejectOnEmpty: false,
    timestamps: false
  })

  return Counter
}
