"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Note extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Note.belongsTo(models.Project, {
        foreignKey: "projectId",
        onDelete: "CASCADE",
      });
    }
  }
  Note.init(
    {
      noteContent: DataTypes.TEXT,
      projectId: DataTypes.UUID,
    },
    {
      sequelize,
      modelName: "Note",
    }
  );
  return Note;
};
