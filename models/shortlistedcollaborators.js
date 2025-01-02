'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ShortlistedCollaborators extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      ShortlistedCollaborators.belongsTo(models.Shortlisting, {
        foreignKey: "ShortlistingId",
        onDelete: "CASCADE",
      });
    }
  }
  ShortlistedCollaborators.init({
    ShortlistingId: DataTypes.INTEGER,
    UserId: DataTypes.UUID,
    ProjectId: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'ShortlistedCollaborators',
  });
  return ShortlistedCollaborators;
};