'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CompanyVerificationStatus extends Model {
    static associate(models) {
      // Define association here
      CompanyVerificationStatus.belongsTo(models.Company, {
        foreignKey: 'companyId',
        as: 'company',
      });
    }
  }
  CompanyVerificationStatus.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      companyId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Company', // This should match your Company model name
          key: 'id',
        },
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      remarks: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'CompanyVerificationStatus',
    }
  );
  return CompanyVerificationStatus;
};
