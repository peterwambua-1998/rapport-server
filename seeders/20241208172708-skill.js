"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Skills",
      [
        {
          name: "Leadership", 
         
          status: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "React", 
         
          status: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "TypeScript", 
          
          status: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Node.js", 
          
          status: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "UI/UX", 
          
          status: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Communication",
   
          status: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Problem Solving",
         
          status: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Project Management",
          
          status: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Team Work",
      
          status: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "Analytical",
   
          status: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => { 
    await queryInterface.bulkDelete("Skills", null, {});
  },
};
