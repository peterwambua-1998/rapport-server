"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    static associate(models) { 
      Payment.belongsTo(models.User, { foreignKey: "userId", as: "user" });
      Payment.belongsTo(models.Subscription, {
        foreignKey: "subscriptionId",
        as: "subscription",
      });
    }
  }

  Payment.init(
    {
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Users", // Reference to Users table
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      subscriptionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Subscriptions", // Reference to Subscriptions table
          key: "id",
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      paymentMethod: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [["mpesa", "paypal", "stripe"]],
        },
      },
      transactionId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "pending",
        validate: {
          isIn: [["pending", "completed", "failed"]],
        },
      },
      paymentDetails: {
        type: DataTypes.JSON, // JSON field for additional payment details
      },
    },
    {
      sequelize,
      modelName: "Payment",
      tableName: "Payments",
      timestamps: true, // Includes createdAt and updatedAt
    }
  );

  return Payment;
};
