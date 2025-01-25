'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CareerGoal extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      CareerGoal.belongsTo(models.User, {
        foreignKey: 'userId'
      })
    }
  }
  CareerGoal.init({
    name: DataTypes.TEXT,
    userId: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'CareerGoal',
  });
  return CareerGoal;
};