module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("CalendarEvents", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      eventDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      eventDescription: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      projectId: {
        type: Sequelize.UUID,
        references: {
          model: "Projects", // Projects table
          key: "id",
        },
        onDelete: "CASCADE",
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("CalendarEvents");
  },
};
