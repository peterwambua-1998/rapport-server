'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class VisibilitySetting extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      VisibilitySetting.belongsTo(models.User, { foreignKey: 'userId', onDelete: 'CASCADE' });
    }
  }
  VisibilitySetting.init({
    userId: DataTypes.UUID,
    basicInfo: DataTypes.BOOLEAN,
    videoIntro: DataTypes.BOOLEAN,
    skills: DataTypes.BOOLEAN,
    education: DataTypes.BOOLEAN,
    experience: DataTypes.BOOLEAN,
    recommendations: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'VisibilitySetting',
  });
  return VisibilitySetting;
};