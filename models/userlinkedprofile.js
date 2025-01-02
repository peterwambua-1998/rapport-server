"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class UserLinkedProfile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define associations here, if needed
      // For example, if `UserLinkedProfile` belongs to a `User` model:
      UserLinkedProfile.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
    }
  }
  UserLinkedProfile.init(
    {
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      linkedinID: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      email_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      given_name: {
        type: DataTypes.STRING,
      },
      family_name: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      country: {
        type: DataTypes.STRING,
      },
      language: {
        type: DataTypes.STRING,
      },
      picture: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "UserLinkedProfile",
    }
  );
  return UserLinkedProfile;
};
