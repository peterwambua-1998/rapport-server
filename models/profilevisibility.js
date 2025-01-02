'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProfileVisibility extends Model {
    static associate(models) {
      // Define associations here if needed
    }
  }
  ProfileVisibility.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      status: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'ProfileVisibility',
    }
  );
  return ProfileVisibility;
};
