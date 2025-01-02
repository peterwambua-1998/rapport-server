"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class JobseekerSkills extends Model {
    static associate(models) {
      JobseekerSkills.belongsTo(models.User, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });

      JobseekerSkills.belongsTo(models.Skill, {
        foreignKey: "skillId",
        onDelete: "CASCADE",
      }); 
    }
  }

  JobseekerSkills.init(
    {
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      
      skillId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "JobseekerSkills",
    }
  );

  return JobseekerSkills;
};
