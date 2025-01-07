'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class YearsOfExperience extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      YearsOfExperience.hasOne(models.JobSeeker, {
        foreignKey: "yearsOfExperience",
        onDelete: "CASCADE",
      });
    }
  }
  YearsOfExperience.init({
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    status: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'YearsOfExperience',
  });
  return YearsOfExperience;
};