module.exports = (sequelize, DataTypes) => {
  const PlanFeature = sequelize.define(
    "PlanFeature",
    {
      plan_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "plans",
          key: "id",
        },
      },
      feature_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "features", // Assuming you have a 'features' table
          key: "id",
        },
      },
      limit: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
    },
    {
      tableName: "plan_features",
      underscored: true,
    }
  );

  PlanFeature.associate = (models) => {
    PlanFeature.belongsTo(models.Plan, { foreignKey: "plan_id" });
    PlanFeature.belongsTo(models.Feature, { foreignKey: "feature_id" });
  };

  return PlanFeature;
};
