"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Skill extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) { 
      Skill.belongsTo(models.User, {
        foreignKey: 'userId' 
      });
    }
  }
  Skill.init(
    {
      userId: DataTypes.UUID,
      name: DataTypes.STRING,
      proficiency:DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Skill",
    }
  );
  return Skill;
};


