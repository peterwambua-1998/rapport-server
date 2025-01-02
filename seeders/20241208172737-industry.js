'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Sample data for the Industry model
    await queryInterface.bulkInsert('Industries', [
      {
        name: 'Technology',
        description: 'The technology sector includes companies that develop or distribute technological goods and services.',
        status: 1,  
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Healthcare',
        description: 'The healthcare industry includes organizations and companies that provide medical services, manufacture medical equipment, or develop pharmaceutical products.',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Finance',
        description: 'The finance industry involves businesses that manage money, including banks, investment firms, insurance companies, and real estate firms.',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Education',
        description: 'The education industry consists of institutions and services that provide education and training.',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Retail',
        description: 'The retail industry involves businesses that sell goods and services directly to consumers.',
        status: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Industries', null, {});
  },
};
