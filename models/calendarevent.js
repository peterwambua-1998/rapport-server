'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CalendarEvent extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      CalendarEvent.belongsTo(models.Project, {
        foreignKey: "projectId",
        onDelete: "CASCADE",
      });
    }
  }
  CalendarEvent.init({
    eventDate: DataTypes.DATE,
    eventDescription: DataTypes.TEXT,
    projectId: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'CalendarEvent',
  });
  return CalendarEvent;
};