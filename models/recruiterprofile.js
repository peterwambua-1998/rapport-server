"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class RecruiterProfile extends Model {
    static associate(models) {
      // Define associations here
      RecruiterProfile.belongsTo(models.User, {
        foreignKey: "user_id",
        onDelete: "CASCADE",
      });

      RecruiterProfile.belongsTo(models.Company, {
        foreignKey: "company_id",
        onDelete: "SET NULL",
      });

      RecruiterProfile.hasMany(models.Conversation, {
        foreignKey: "recruiterId",
        onDelete: "SET NULL",
      });
    }
  }

  RecruiterProfile.init(
    {
      user_id: { type: DataTypes.UUID, allowNull: false },
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
      company_name: DataTypes.STRING,
      country: DataTypes.STRING,
      company_id: DataTypes.INTEGER,
      years_of_experience: DataTypes.INTEGER,
      specialization: DataTypes.TEXT,
      successful_placements: DataTypes.INTEGER,
      platform_tenure: DataTypes.STRING,
      response_rate: DataTypes.DECIMAL(5, 2),
      about: DataTypes.TEXT,
      role: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "RecruiterProfile",
      tableName: "RecruiterProfiles",
      underscored: true,
    }
  );
  return RecruiterProfile;
};
