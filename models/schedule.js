'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Schedule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Schedule.belongsTo(models.Project, {foreignKey: 'ProjectId'})
      Schedule.belongsTo(models.JobSeeker, {foreignKey: 'JobSeekerId'})
      Schedule.belongsTo(models.User, {foreignKey: 'RecruiterId'})
      
    }
  }
  Schedule.init({
    ProjectId: DataTypes.UUID,
    JobSeekerId: DataTypes.UUID,
    RecruiterId: DataTypes.UUID,
    InterviewDate: DataTypes.DATE,
    Note: DataTypes.STRING,
    Status: DataTypes.STRING //pending,  accepted, reject, canceled 
  }, {
    sequelize,
    modelName: 'Schedule',
  });
  return Schedule;
};