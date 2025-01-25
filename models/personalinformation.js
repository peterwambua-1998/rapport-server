'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PersonalInformation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      PersonalInformation.belongsTo(models.User, {
        foreignKey: 'userId',
      })
    }
  }
  PersonalInformation.init({
    about: DataTypes.TEXT,
    location: DataTypes.STRING,
    industry: DataTypes.STRING,
    userId: DataTypes.UUID,
    videoAnalysis: DataTypes.JSON,
  }, {
    sequelize,
    modelName: 'PersonalInformation',
  });
  return PersonalInformation;
};