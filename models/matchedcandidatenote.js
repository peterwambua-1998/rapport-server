'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class MatchedCandidateNote extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      MatchedCandidateNote.belongsTo(models.MatchedCandidate, {
        foreignKey: "MatchedCandidateId",
        onDelete: "CASCADE",
      });
    }
  }
  MatchedCandidateNote.init({
    MatchedCandidateId: DataTypes.INTEGER,
    Note: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'MatchedCandidateNote',
  });
  return MatchedCandidateNote;
};