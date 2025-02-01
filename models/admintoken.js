'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AdminToken extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  AdminToken.init({
    encryptedToken: DataTypes.TEXT,
    iv: DataTypes.STRING,
    authTag: DataTypes.STRING,
    expiresAt: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'AdminToken',
  });
  return AdminToken;
};