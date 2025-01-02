"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Project.belongsTo(models.User, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });

      Project.hasMany(models.Schedule, {
        foreignKey: "ProjectId",
        onDelete: "CASCADE",
      });
      Project.hasMany(models.ShortlistedCandidates, {
        foreignKey: "ProjectId",
        onDelete: "CASCADE",
      });
      Project.hasMany(models.Note, {
        foreignKey: "projectId",
        onDelete: "CASCADE",
      });
      Project.hasMany(models.MatchedCandidate, {
        foreignKey: "ProjectId",
        onDelete: "CASCADE",
      });

      Project.hasMany(models.Schedule, {foreignKey: 'ProjectId'})
    }
  }
  Project.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      userId: DataTypes.UUID,
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      status: DataTypes.BOOLEAN,
      foundCandidate: DataTypes.BOOLEAN,
      projectSearchDuration: DataTypes.TEXT,
      feedback: DataTypes.TEXT,
      rating: DataTypes.STRING, // Select Rating Excellent, Good, Fair, Poor
    },
    {
      sequelize,
      modelName: "Project",
    }
  );
  return Project;
};
