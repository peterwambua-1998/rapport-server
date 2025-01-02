"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class JobSeeker extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      JobSeeker.belongsTo(models.User, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });

      JobSeeker.hasMany(models.Recommendation, {
        foreignKey: "jobSeekerId",
        onDelete: "CASCADE",
      });

      JobSeeker.belongsTo(models.Industry, {
        foreignKey: "industry",
        onDelete: "CASCADE",
      });

      JobSeeker.belongsTo(models.EducationLevel, {
        foreignKey: "educationLevel",
        onDelete: "CASCADE",
      });

      JobSeeker.belongsTo(models.YearsOfExperience, {
        foreignKey: "yearsOfExperience",
        onDelete: "CASCADE",
      });

      JobSeeker.belongsTo(models.SkillLevel, {
        foreignKey: "skillLevel",
        onDelete: "CASCADE",
      });

      JobSeeker.hasMany(models.ShortlistedCandidates, {
        foreignKey: "UserId", // Ensure the foreignKey matches the reference in ShortlistedCandidates
        onDelete: "CASCADE",
      });

      JobSeeker.hasMany(models.Conversation, {
        foreignKey: "recruiterId",
        onDelete: "SET NULL",
      });
    }
  }

  // industry educationLevel yearsOfExperience skillLevel
  JobSeeker.init(
    {
      userId: DataTypes.UUID,
      fullName: DataTypes.STRING,
      phone: DataTypes.STRING,
      professionalTitle: DataTypes.STRING,
      address: DataTypes.TEXT,
      city: DataTypes.STRING,
      state: DataTypes.STRING,
      zipCode: DataTypes.STRING,
      industry: DataTypes.STRING,
      educationLevel: DataTypes.STRING,
      yearsOfExperience: DataTypes.STRING,
      skillLevel: DataTypes.STRING,
      about: DataTypes.TEXT,
      videoUrl: DataTypes.STRING,
      backgroundColor: DataTypes.STRING,
      layoutStyle: DataTypes.STRING,
      profileVisible: DataTypes.BOOLEAN,
      activeStatus: DataTypes.BOOLEAN,
      terms: DataTypes.BOOLEAN,
      videoAnalysis: DataTypes.JSON,
    },
    {
      sequelize,
      modelName: "JobSeeker",
    }
  );
  return JobSeeker;
}; 
