'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Preference extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Preference.belongsTo(models.User, {
        foreignKey: 'userId'
      })
    }
  }
  Preference.init({
    userId: DataTypes.UUID,
    profileVisible: DataTypes.BOOLEAN,
    activeStatus: DataTypes.BOOLEAN,
    bgColor: DataTypes.STRING,
    skills: DataTypes.BOOLEAN,
    education: DataTypes.BOOLEAN,
    experience: DataTypes.BOOLEAN,
    profInfo: DataTypes.BOOLEAN,
    careerGoals: DataTypes.BOOLEAN,
    recruiterViewsProfile: DataTypes.BOOLEAN,
    releases: DataTypes.BOOLEAN,
    promotions: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Preference',
  });
  return Preference;
};