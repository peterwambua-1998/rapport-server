'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Preferences', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.UUID
      },
      profileVisible: {
        type: Sequelize.BOOLEAN
      },
      activeStatus: {
        type: Sequelize.BOOLEAN
      },
      bgColor: {
        type: Sequelize.STRING
      },
      skills: {
        type: Sequelize.BOOLEAN
      },
      education: {
        type: Sequelize.BOOLEAN
      },
      experience: {
        type: Sequelize.BOOLEAN
      },
      profInfo: {
        type: Sequelize.BOOLEAN
      },
      careerGoals: {
        type: Sequelize.BOOLEAN
      },
      promotions: {
        type: Sequelize.BOOLEAN
      },
      recruiterViewsProfile: {
        type: Sequelize.BOOLEAN
      },
      releases: {
        type: Sequelize.BOOLEAN
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
    await queryInterface.dropTable('Preferences');
  }
};