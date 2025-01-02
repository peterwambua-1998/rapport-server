'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class userVerificationStatus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define the association with the User model
      userVerificationStatus.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user',
      });
    }
  }

  userVerificationStatus.init({
    userId: {
      type: DataTypes.UUID,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'userVerificationStatus',
    tableName: 'user_verification_statuses',

  });

  return userVerificationStatus;
};
