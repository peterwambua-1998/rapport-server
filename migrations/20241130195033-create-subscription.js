'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Subscriptions', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id', 
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      planId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'plans', 
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      status: {
        type: Sequelize.ENUM('active', 'canceled', 'expired', 'past_due', 'trialing', 'pending'),
        defaultValue: 'active',
      },
      billingCycle: {
        type: Sequelize.ENUM('monthly', 'yearly'),
        allowNull: false,
      },
      startDate: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
      },
      endDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      trialEndDate: {
        type: Sequelize.DATE,
      },
      cancelAtPeriodEnd: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      lastBillingDate: {
        type: Sequelize.DATE,
      },
      nextBillingDate: {
        type: Sequelize.DATE,
      },
      currentPeriodStart: {
        type: Sequelize.DATE,
      },
      currentPeriodEnd: {
        type: Sequelize.DATE,
      },
      paymentMethod: {
        type: Sequelize.ENUM('credit_card', 'paypal', 'bank_transfer', 'stripe'),
        allowNull: false,
      },
      paymentMethodDetails: {
        type: Sequelize.JSONB,
      },
      quantity: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
      totalAmount: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      currency: {
        type: Sequelize.STRING,
        defaultValue: 'USD',
      },
      taxAmount: {
        type: Sequelize.FLOAT,
        defaultValue: 0,
      }, 
      cancelReason: {
        type: Sequelize.STRING,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()'),
      },
    });

    // Add indexes
    await queryInterface.addIndex('Subscriptions', ['userId', 'status']);
    await queryInterface.addIndex('Subscriptions', ['planId', 'status']);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Subscriptions');
  },
};
