'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Experience extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Experience.belongsTo(models.User, {
        foreignKey: 'userId',
      })
    }
  }
  Experience.init({
    position: DataTypes.STRING,
    employer: DataTypes.STRING,
    description: DataTypes.TEXT,
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    currentlyWorking: DataTypes.BOOLEAN,
    userId: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'Experience',
  });
  return Experience;
};