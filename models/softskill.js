'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SoftSkill extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SoftSkill.belongsTo(models.User, {
        foreignKey: 'userId'
      })
    }
  }
  SoftSkill.init({
    name: DataTypes.STRING,
    userId: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'SoftSkill',
  });
  return SoftSkill;
};