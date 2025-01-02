module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Conversations", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      ProjectId: {
        type: Sequelize.UUID,
      },
      ScheduleId: {
        type: Sequelize.INTEGER,
      },
      recruiterId: {
        type: Sequelize.UUID,
      },
      jobSeekerId: {
        type: Sequelize.UUID,
      },
      role: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.STRING,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("NOW()"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal("NOW()"),
      },
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable("Conversations");
  },
};
