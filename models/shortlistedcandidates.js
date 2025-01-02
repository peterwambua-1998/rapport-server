'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ShortlistedCandidates extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ShortlistedCandidates.belongsTo(models.Shortlisting, {
        foreignKey: "ShortlistingId",
        onDelete: "CASCADE",
      });

      ShortlistedCandidates.belongsTo(models.JobSeeker, {
        foreignKey: "UserId", // Assuming UserId in ShortlistedCandidates refers to the JobSeeker
        onDelete: "CASCADE",
      });

      ShortlistedCandidates.belongsTo(models.User, {
        foreignKey: "UserId", // Assuming UserId in ShortlistedCandidates refers to the JobSeeker
        onDelete: "CASCADE",
      });

      ShortlistedCandidates.belongsTo(models.Project, {
        foreignKey: "ProjectId", // Assuming UserId in ShortlistedCandidates refers to the JobSeeker
        onDelete: "CASCADE",
      });
    }
  }
  ShortlistedCandidates.init({
    ShortlistingId: DataTypes.INTEGER,
    UserId: DataTypes.UUID,
    ProjectId: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'ShortlistedCandidates',
  });
  return ShortlistedCandidates;
};