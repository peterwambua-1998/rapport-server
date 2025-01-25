'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProfessionalInformation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ProfessionalInformation.belongsTo(models.User, {
        foreignKey: 'userId',
      })
    }
  }
  ProfessionalInformation.init({
    userId: DataTypes.UUID,
    professionalTitle: DataTypes.STRING,
    yearsOfExperience: DataTypes.INTEGER,
    currentRole: DataTypes.STRING,
    company: DataTypes.STRING,
    linkedIn: DataTypes.STRING,
    portfolio: DataTypes.STRING,
    github: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'ProfessionalInformation',
  });
  return ProfessionalInformation;
};