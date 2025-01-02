"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Invoice extends Model {
    static associate(models) {
      // Associations
      Invoice.belongsTo(models.User, { foreignKey: "userId", as: "user" });
      Invoice.belongsTo(models.Subscription, {
        foreignKey: "subscriptionId",
        as: "subscription",
      });
    }
  }

  Invoice.init(
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
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "pending",
        validate: {
          isIn: [["pending", "paid", "failed", "cancelled"]],
        },
      },
      paymentMethod: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isIn: [["mpesa", "paypal", "credit_card"]],
        },
      },
      paymentId: {
        type: DataTypes.STRING,
      },
      invoiceNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      items: {
        type: DataTypes.JSON, // JSON field to store invoice items
      },
      subtotal: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      tax: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      dueDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      paidAt: {
        type: DataTypes.DATE,
      },
      billingPeriodStart: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      billingPeriodEnd: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Invoice",
      tableName: "Invoices",
      timestamps: true, // Includes createdAt and updatedAt
      hooks: {
        // Pre-save hook to generate invoice number
        beforeCreate: async (invoice, options) => {
          const lastInvoice = await Invoice.findOne({
            order: [["createdAt", "DESC"]],
          });
          const lastNumber = lastInvoice
            ? parseInt(lastInvoice.invoiceNumber.split("-")[1])
            : 0;
          invoice.invoiceNumber = `INV-${(lastNumber + 1)
            .toString()
            .padStart(6, "0")}`;
        },
      },
    }
  );

  return Invoice;
};
