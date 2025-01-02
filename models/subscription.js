"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Subscription extends Model {
    static associate(models) {
      // Associations
      Subscription.belongsTo(models.User, { foreignKey: "userId", as: "user" });
      Subscription.belongsTo(models.Plan, { foreignKey: "planId", as: "plan" });
    }
  }

  Subscription.init(
    {
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      planId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(
          "active",
          "canceled",
          "expired",
          "past_due",
          "trialing",
          "pending"
        ),
        defaultValue: "active",
      },
      billingCycle: {
        type: DataTypes.ENUM("monthly", "yearly"),
        allowNull: false,
      },
      startDate: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal("NOW()"),
      },
      endDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      trialEndDate: {
        type: DataTypes.DATE,
      },
      cancelAtPeriodEnd: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      lastBillingDate: {
        type: DataTypes.DATE,
      },
      nextBillingDate: {
        type: DataTypes.DATE,
      },
      currentPeriodStart: {
        type: DataTypes.DATE,
      },
      currentPeriodEnd: {
        type: DataTypes.DATE,
      },
      paymentMethod: {
        type: DataTypes.ENUM("credit_card", "paypal", "bank_transfer", "mpesa"),
        allowNull: false,
      },
      paymentMethodDetails: {
        type: DataTypes.JSONB, // PostgreSQL-specific type
      },
      quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
        validate: {
          min: 1,
        },
      },
      totalAmount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      currency: {
        type: DataTypes.STRING,
        defaultValue: "USD",
      },
      taxAmount: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      cancelReason: {
        type: DataTypes.STRING,
      },
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
      modelName: "Subscription",
      tableName: "Subscriptions",
    }
  );

  return Subscription;
};
