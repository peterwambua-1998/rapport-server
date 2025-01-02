"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Candidate extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Candidate.belongsTo(models.Project, {
        foreignKey: "projectId",
        onDelete: "CASCADE",
      });
    }
  }

  Candidate.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      phone: DataTypes.STRING,
      projectId: DataTypes.UUID,
    },
    {
      sequelize,
      modelName: "Candidate",
      
    }
  );
  return Candidate;
};
