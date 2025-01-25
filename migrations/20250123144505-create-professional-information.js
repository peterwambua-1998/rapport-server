'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ProfessionalInformations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.UUID,
      },
      professionalTitle: {
        type: Sequelize.STRING
      },
      yearsOfExperience: {
        type: Sequelize.INTEGER
      },
      currentRole: {
        type: Sequelize.STRING
      },
      company: {
        type: Sequelize.STRING
      },
      linkedIn: {
        type: Sequelize.STRING
      },
      portfolio: {
        type: Sequelize.STRING
      },
      github: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('ProfessionalInformations');
  }
};