'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Shortlisting extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Shortlisting.hasMany(models.ShortlistedCandidates, {
        foreignKey: "ShortlistingId",
        onDelete: "CASCADE",
      });

      Shortlisting.hasMany(models.ShortlistedCollaborators, {
        foreignKey: "ShortlistingId",
        onDelete: "CASCADE",
      });
    }
  }
  Shortlisting.init({
    UserId: DataTypes.UUID,
    ProjectId: DataTypes.UUID,
    note: {type: DataTypes.STRING, allowNull: true},
    status: DataTypes.BOOLEAN, 
  }, {
    sequelize,
    modelName: 'Shortlisting',
  });
  return Shortlisting;
};