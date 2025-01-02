"use strict";
const bcrypt = require("bcrypt");

module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash("12345678", 10);
    await queryInterface.bulkInsert("Users", [
      {
        name: "John Doe",
        email: "johndoe@gmail.com",
        password: hashedPassword,
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "Dan Doe",
        email: "dan@gmail.com",
        password: hashedPassword,
        role: "job_seeker",
        isVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", { email: "johndoe@gmail.com" });
  },
};
