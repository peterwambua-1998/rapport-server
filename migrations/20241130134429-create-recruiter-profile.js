"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("RecruiterProfiles", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      first_name: {
        type: Sequelize.STRING,
      },
      last_name: {
        type: Sequelize.STRING,
      },
      company_name: {
        type: Sequelize.STRING,
      },
      country: {
        type: Sequelize.STRING,
      },
      company_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "Companies",
          key: "id",
        },
        onDelete: "SET NULL",
      },
      years_of_experience: {
        type: Sequelize.INTEGER,
      },
      specialization: {
        type: Sequelize.TEXT,
      },
      successful_placements: {
        type: Sequelize.INTEGER,
      },
      platform_tenure: {
        type: Sequelize.STRING,
      },
      response_rate: {
        type: Sequelize.DECIMAL(5, 2),
      },
      about: {
        type: Sequelize.TEXT,
      },   
      role: {
        type: Sequelize.STRING,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("RecruiterProfiles");
  },
};
