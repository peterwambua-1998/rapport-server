"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
      },
      fName: {
        type: Sequelize.STRING,
      },
      mName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      lName: {
        type: Sequelize.STRING,
      },
      phone: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      password: {
        type: Sequelize.STRING,
      },
      role: {
        type: Sequelize.ENUM("job_seeker", "recruiter", "admin"),
        allowNull: false,
      },
      avatar: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      cover_photo: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      video_path: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      resetPasswordToken: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      resetPasswordExpire: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      linkedinId: {
        type: Sequelize.STRING,
      },
      linkedinIdLogin: {
        type: Sequelize.BOOLEAN,
        default: false,
      },
      verificationToken: {
        type: Sequelize.STRING,
        allowNull: true
      },
      isVerified: {
        type: Sequelize.BOOLEAN,
        default: false,
      },
      status: {
        type: Sequelize.BOOLEAN,
        default: false,
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
    await queryInterface.dropTable("Users");
  },
};
