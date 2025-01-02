"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Session extends Model {
    static associate(models) {
      // Define associations if necessary
    }
  }
  Session.init(
    {
      sid: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      expires: DataTypes.DATE,
      data: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Session",
      tableName: "sessions",
      timestamps: true,
    }
  );
  return Session;
};
