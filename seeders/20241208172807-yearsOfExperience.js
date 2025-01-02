"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "YearsOfExperiences",
      [
        {
          name: "0-1 Years",
          description:
            "Less than a year of experience, suitable for freshers or entry-level positions.",
          status: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "1-3 Years",
          description:
            "1 to 3 years of experience, suitable for junior-level professionals with some exposure to the field.",
          status: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "3-5 Years",
          description:
            "3 to 5 years of experience, suitable for mid-level professionals with established skills and knowledge.",
          status: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "5-10 Years",
          description:
            "5 to 10 years of experience, suitable for senior professionals with significant expertise in the field.",
          status: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "10+ Years",
          description:
            "Over 10 years of experience, suitable for experts or highly experienced professionals in the field.",
          status: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("YearsOfExperiences", null, {});
  },
};
