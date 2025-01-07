"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("JobSeekers", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      userId: {
        type: Sequelize.UUID,
      },
      fullName: {
        type: Sequelize.STRING,
      },
      phone: {
        type: Sequelize.STRING,
      },
      professionalTitle: {
        type: Sequelize.STRING,
      },
      address: {
        type: Sequelize.TEXT,
      },
      city: {
        type: Sequelize.STRING,
      },
      state: {
        type: Sequelize.STRING,
      },
      zipCode: {
        type: Sequelize.STRING,
      },
      industry: {
        type: Sequelize.INTEGER,
      },
      educationLevel: {
        type: Sequelize.INTEGER,
      },
      yearsOfExperience: {
        type: Sequelize.INTEGER,
      },
      skillLevel: {
        type: Sequelize.INTEGER,
      },
      about: {
        type: Sequelize.TEXT,
      }, 
      videoUrl: {
        type: Sequelize.STRING,
      },
      backgroundColor: {
        type: Sequelize.STRING,
      },
      layoutStyle: {
        type: Sequelize.STRING,
      },
      profileVisible: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      activeStatus: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },
      terms: {
        type: Sequelize.BOOLEAN,
      },
      videoAnalysis: {
        type: Sequelize.JSON,
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
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("JobSeekers");
  },
};
