'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Country extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      
    }
  }
  Country.init({
    iso: DataTypes.STRING,
    name: DataTypes.STRING,
    phonecode: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Country',
  });
  return Country;
};