'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TestimonialRequest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      TestimonialRequest.belongsTo(models.User, {
        foreignKey: 'userId'
      })
    }
  }
  TestimonialRequest.init({
    userId: DataTypes.UUID,
    recipientName: DataTypes.STRING,
    email: DataTypes.STRING,
    description: DataTypes.TEXT,
    token: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'TestimonialRequest',
  });
  return TestimonialRequest;
};