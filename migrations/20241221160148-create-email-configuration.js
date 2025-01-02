'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('EmailConfigurations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      host: {
        type: Sequelize.STRING,
      },
      port: {
        type: Sequelize.INTEGER,
      },
      secure: {
        type: Sequelize.BOOLEAN,
      },
      user: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
      },
      from: {
        type: Sequelize.STRING,
      }, 
      status: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('EmailConfigurations');
  },
};
