'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PersonalInformations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      about: {
        type: Sequelize.TEXT
      },
      location: {
        type: Sequelize.STRING
      },
      industry: {
        type: Sequelize.STRING
      },
      userId: {
        type: Sequelize.UUID
      },
      videoAnalysis: {
        type: Sequelize.JSON,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('PersonalInformations');
  }
};