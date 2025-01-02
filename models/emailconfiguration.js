'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class EmailConfiguration extends Model {
    static associate(models) {
      // Define associations here if needed
    }
  }
  EmailConfiguration.init(
    {
      host: DataTypes.STRING,
      port: DataTypes.INTEGER,
      secure: DataTypes.BOOLEAN,
      user: DataTypes.STRING,
      password: DataTypes.STRING,
      from: DataTypes.STRING,
      status: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'EmailConfiguration',
    }
  );
  return EmailConfiguration;
};
