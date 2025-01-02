"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => { 
    await queryInterface.bulkInsert(
      "SkillLevels",
      [
        {
          name: "Beginner",
          description:
            "A basic level of understanding of the skill. Suitable for those who are just starting to learn.",
          status: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Intermediate",
          description:
            "An intermediate level where the individual has a reasonable understanding of the skill and can apply it in various situations.",
          status: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Advanced",
          description:
            "An advanced level of proficiency. Individuals at this level can handle complex tasks and challenges with ease.",
          status: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Expert",
          description:
            "An expert level of skill with deep, specialized knowledge and experience in the field.",
          status: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("SkillLevels", null, {});
  },
};
