module.exports = (sequelize, DataTypes) => {
  const Plan = sequelize.define(
    "Plan",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      description: {
        type: DataTypes.STRING,
      },
      monthly_price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      monthly_currency: {
        type: DataTypes.STRING,
        defaultValue: "USD",
      },
      yearly_price: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      yearly_currency: {
        type: DataTypes.STRING,
        defaultValue: "USD",
      },
      trial_period_days: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      max_users: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
    },
    {
      tableName: "plans",
      underscored: true,
    }
  );

  Plan.associate = (models) => {
    Plan.belongsTo(models.User, { foreignKey: "created_by" });
    Plan.hasMany(models.PlanFeature, { foreignKey: "plan_id" });
  };

  return Plan;
};
