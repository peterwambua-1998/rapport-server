'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MatchedCandidate extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      MatchedCandidate.belongsTo(models.User, {
        foreignKey: "UserId",
        onDelete: "CASCADE",
      });

      MatchedCandidate.belongsTo(models.Project, {
        foreignKey: "ProjectId",
        onDelete: "CASCADE",
      });

      MatchedCandidate.hasMany(models.MatchedCandidateNote, {
        foreignKey: "MatchedCandidateId",
        onDelete: "CASCADE",
      });
    }
  }
  MatchedCandidate.init({
    UserId: DataTypes.UUID,
    ProjectId: DataTypes.UUID,
    Status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'MatchedCandidate',
  });
  return MatchedCandidate;
};