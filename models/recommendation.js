'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Recommendation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Recommendation.belongsTo(models.JobSeeker, { foreignKey: 'jobSeekerId', onDelete: 'CASCADE' });
    }
  }
  Recommendation.init({
    jobSeekerId: DataTypes.INTEGER,
    content: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Recommendation',
  });
  return Recommendation;
};