'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Interview extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Interview.belongsTo(models.User, {
        foreignKey: 'userId'
      })
    }
  }
  Interview.init({
    userId: DataTypes.UUID,
    video: DataTypes.STRING,
    feedback: DataTypes.TEXT,
    grade: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Interview',
  });
  return Interview;
};