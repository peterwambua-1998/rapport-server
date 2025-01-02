"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Conversation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Conversation.belongsTo(models.User, {
        foreignKey: "recruiterId",
        as: "recruiter",
        onDelete: "CASCADE",
      });

      Conversation.belongsTo(models.User, {
        foreignKey: "jobSeekerId",
        as: "jobSeeker",
        onDelete: "CASCADE",
      });


      Conversation.belongsTo(models.Project, {
        foreignKey: "ProjectId",
        onDelete: "CASCADE",
      });

      Conversation.hasMany(models.Message, {
        foreignKey: "conversationId",
        onDelete: "CASCADE",
      });

      Conversation.belongsTo(models.Schedule, {
        foreignKey: "ScheduleId",
        onDelete: "CASCADE",
      });
    }
  } 

  Conversation.init(
    {
      recruiterId: DataTypes.UUID,
      jobSeekerId: DataTypes.UUID,
      ProjectId: DataTypes.UUID,
      ScheduleId: DataTypes.INTEGER,
      role: DataTypes.STRING,
      status: DataTypes.STRING, 
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal("NOW()"),
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal("NOW()"),
      },
    },
    {
      sequelize,
      modelName: "Conversation", 
    }
  );
  return Conversation;
};
