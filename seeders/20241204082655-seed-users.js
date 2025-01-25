"use strict";
const bcrypt = require("bcrypt");

module.exports = {
  async up(queryInterface, Sequelize) {
    const hashedPassword = await bcrypt.hash("12345678", 10);
    await queryInterface.bulkInsert("Users", [
      {
        fName: "John",
        lName: "Doe",
        phone:  "+1 (322) 903-4551",
        email: "johndoe@gmail.com",
        password: hashedPassword,
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // {
      //   name: "Dan Doe",
      //   email: "dan@gmail.com",
      //   password: hashedPassword,
      //   role: "job_seeker",
      //   isVerified: true,
      //   createdAt: new Date(),
      //   updatedAt: new Date(),
      // },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("Users", { email: "johndoe@gmail.com" });
  },
};
