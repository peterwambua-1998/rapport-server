'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class JobSeekerStat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      JobSeekerStat.belongsTo(models.User, {
        foreignKey: 'userId'
      })
    }
  }
  JobSeekerStat.init({
    userId: DataTypes.UUID,
    profileViews: DataTypes.INTEGER,
    searchAppearance: DataTypes.INTEGER,
    interviewsCompleted: DataTypes.INTEGER,
    challengesCompleted: DataTypes.INTEGER,
    daysOnPlatform: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'JobSeekerStat',
  });
  return JobSeekerStat;
};