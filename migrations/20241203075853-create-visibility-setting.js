'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('VisibilitySettings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.UUID
      },
      jobSeekerId: {
        type: Sequelize.INTEGER
      },
      basicInfo: {
        type: Sequelize.BOOLEAN
      },
      videoIntro: {
        type: Sequelize.BOOLEAN
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
      recommendations: {
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
    await queryInterface.dropTable('VisibilitySettings');
  }
};