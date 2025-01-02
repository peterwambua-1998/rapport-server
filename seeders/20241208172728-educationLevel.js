"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "EducationLevels",
      [
        {
          name: "High School",
          description:
            "High school education, typically completed by students aged 14-18. It provides foundational education in various subjects.",
          status: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Bachelor's Degree",
          description:
            "A four-year undergraduate degree awarded by universities or colleges upon completion of a course of study in a specific field.",
          status: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Master's Degree",
          description:
            "A postgraduate degree awarded after the completion of a program of study beyond a Bachelor's degree. It typically takes 1-2 years.",
          status: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "PhD",
          description:
            "The highest level of academic degree, awarded after the completion of advanced research in a specific area of study.",
          status: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("EducationLevels", null, {});
  },
};
