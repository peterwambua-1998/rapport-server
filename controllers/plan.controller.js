const { Plan, PlanFeature } = require("../models");

/**
 * Get all plans
 * @param {Object} req
 * @param {Object} res
 */
exports.getAllPlans = async (req, res) => {
  try {
    const plans = await Plan.findAll({
      include: [{ model: PlanFeature }], // Include associated plan features
    });

    res.status(200).json(plans);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching plans", error: error.message });
  }
};

/**
 * Create a new plan
 * @param {Object} req
 * @param {Object} res
 */
exports.createPlan = async (req, res) => {
  try {
    const {
      name,
      description,
      monthly_price,
      yearly_price,
      trialPeriodDays,
      isActive,
      maxUsers,
      createdBy,
    } = req.body;

    // Create a new plan
    const plan = await Plan.create({
      name,
      description,
      monthly_price,
      yearly_price,
      trialPeriodDays,
      isActive,
      maxUsers,
      createdBy,
    });

    // Add features to the plan if provided
    // if (features && features.length > 0) {
    //   const planFeatures = features.map((feature) => ({
    //     plan_id: plan.id,
    //     featureId: feature.featureId,
    //     limit: feature.limit,
    //   }));
    //   await PlanFeature.bulkCreate(planFeatures);
    // }

    res.status(201).json({ message: "Plan created successfully", data: plan });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating plan", error: error.message });
  }
};

/**
 * Get a plan by ID
 * @param {Object} req
 * @param {Object} res
 */
exports.getPlan = async (req, res) => {
  try {
    const { id } = req.params;
    const plan = await Plan.findByPk(id, {
      include: [{ model: PlanFeature }],
    });

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    res
      .status(200)
      .json({ message: "Plan retrieved successfully", data: plan });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching plan", error: error.message });
  }
};

/**
 * Update a plan by ID
 * @param {Object} req
 * @param {Object} res
 */
exports.updatePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      monthly,
      yearly,
      features,
      trialPeriodDays,
      isActive,
      maxUsers,
    } = req.body;

    const plan = await Plan.findByPk(id);

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    // Update the plan
    await plan.update({
      name,
      description,
      monthly,
      yearly,
      trialPeriodDays,
      isActive,
      maxUsers,
    });

    // Update features if provided
    if (features && features.length > 0) {
      await PlanFeature.destroy({ where: { plan_id: id } }); // Remove existing features
      const planFeatures = features.map((feature) => ({
        plan_id: plan.id,
        featureId: feature.featureId,
        limit: feature.limit,
      }));
      await PlanFeature.bulkCreate(planFeatures);
    }

    res.status(200).json({ message: "Plan updated successfully", data: plan });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating plan", error: error.message });
  }
};

/**
 * Delete a plan by ID
 * @param {Object} req
 * @param {Object} res
 */
exports.deletePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const plan = await Plan.findByPk(id);

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    // Delete the plan
    await plan.destroy();
    res.status(200).json({ message: "Plan deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting plan", error: error.message });
  }
};

/**
 * Update the status of a plan by ID
 * @param {Object} req
 * @param {Object} res
 */
exports.updatePlanStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    const plan = await Plan.findByPk(id);

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    // Update the plan's status (active or inactive)
    await plan.update({ isActive });
    res
      .status(200)
      .json({ message: "Plan status updated successfully", data: plan });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating plan status", error: error.message });
  }
};

/**
 * Update plan features
 * @param {Object} req
 * @param {Object} res
 */
exports.updatePlanFeatures = async (req, res) => {
  try {
    const { id } = req.params;
    const features = req.body;

    const plan = await Plan.findByPk(id);

    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    // Update features if provided
    if (features && features.length > 0) {
      await PlanFeature.destroy({ where: { plan_id: id } });

      const planFeatures = features.map((feature) => ({
        plan_id: plan.id,
        feature_id: feature.feature,
        limit: feature.limit,
      }));

      await PlanFeature.bulkCreate(planFeatures);
    }

    res.status(200).json({
      message: "Plan features updated successfully",
      data: plan,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating plan features", error: error.message });
  }
};
