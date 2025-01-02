const { Subscription, Invoice, Payment } = require("../models");
const { Plan } = require("../models");
const { User } = require("../models");

/**
 * Subscribe to a plan
 * @param {Object} req
 * @param {Object} res
 */
exports.subscribeToPlan = async (req, res) => {
  try {
    const { planId, userId } = req.body;

    const plan = await Plan.findByPk(planId);
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    // Create a subscription record
    const subscription = await Subscription.create({
      userId,
      planId,
      startDate: new Date(),
      status: "active",
    });

    res
      .status(201)
      .json({ message: "Subscription created", data: subscription });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error subscribing to plan", error: error.message });
  }
};

/**
 * Cancel a subscription
 * @param {Object} req
 * @param {Object} res
 */
exports.cancelSubscription = async (req, res) => {
  try {
    const { subscriptionId } = req.params;

    const subscription = await Subscription.findByPk(subscriptionId);
    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    // Update subscription status to 'canceled'
    await subscription.update({ status: "canceled" });
    res.status(200).json({ message: "Subscription canceled successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error canceling subscription", error: error.message });
  }
};

/**
 * Change a subscription plan
 * @param {Object} req
 * @param {Object} res
 */
exports.changePlan = async (req, res) => {
  try {
    const { subscriptionId, newPlanId } = req.body;

    const subscription = await Subscription.findByPk(subscriptionId);
    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    const newPlan = await Plan.findByPk(newPlanId);
    if (!newPlan) {
      return res.status(404).json({ message: "New plan not found" });
    }

    // Update the subscription with the new plan
    await subscription.update({ planId: newPlanId });
    res
      .status(200)
      .json({ message: "Plan changed successfully", data: subscription });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error changing plan", error: error.message });
  }
};

/**
 * Get active subscription
 * @param {Object} req
 * @param {Object} res
 */
exports.getActiveSubscription = async (req, res) => {
  try {
    // const userId = req.user.id; // Assuming user ID comes from the auth middleware
    const userId = 1;
    const subscription = await Subscription.findOne({
      where: { userId, status: "active" },
      include: [{ model: Plan, as: "plan" }],
    });
 
    res
      .status(200)
      .json({ message: "Active subscription", data: subscription });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error retrieving active subscription",
      error: error.message,
    });
  }
};

/**
 * Get subscription history
 * @param {Object} req
 * @param {Object} res
 */
exports.getSubscriptionHistory = async (req, res) => {
  try {
    // const userId = req.user.id;
    const userId = 1;
    const subscriptions = await Subscription.findAll({
      where: { userId },
      include: [{ model: Plan, as: "plan" }],
    });

    res
      .status(200)
      .json({ message: "Subscription history", data: subscriptions });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving subscription history",
      error: error.message,
    });
  }
};

/**
 * Renew a subscription
 * @param {Object} req
 * @param {Object} res
 */
exports.renewSubscription = async (req, res) => {
  try {
    const { subscriptionId } = req.params;

    const subscription = await Subscription.findByPk(subscriptionId);
    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    // Renew subscription logic (e.g., extend the end date, mark as active)
    await subscription.update({ status: "active", startDate: new Date() });
    res.status(200).json({
      message: "Subscription renewed successfully",
      data: subscription,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error renewing subscription", error: error.message });
  }
};

/**
 * Pause a subscription
 * @param {Object} req
 * @param {Object} res
 */
exports.pauseSubscription = async (req, res) => {
  try {
    const { subscriptionId } = req.params;

    const subscription = await Subscription.findByPk(subscriptionId);
    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    // Pause subscription logic
    await subscription.update({ status: "paused" });
    res.status(200).json({ message: "Subscription paused successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error pausing subscription", error: error.message });
  }
};

/**
 * Resume a paused subscription
 * @param {Object} req
 * @param {Object} res
 */
exports.resumeSubscription = async (req, res) => {
  try {
    const { subscriptionId } = req.params;

    const subscription = await Subscription.findByPk(subscriptionId);
    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    // Resume subscription logic
    await subscription.update({ status: "active" });
    res.status(200).json({ message: "Subscription resumed successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error resuming subscription", error: error.message });
  }
};

/**
 * Get all invoices
 * @param {Object} req
 * @param {Object} res
 */
exports.getInvoices = async (req, res) => {
  try {
    // const userId = req.user.id;
    const userId = 1;
    const invoices = await Invoice.findAll({ where: { userId: userId } });

    res
      .status(200)
      .json({ message: "Invoices retrieved successfully", data: invoices });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving invoices", error: error.message });
  }
};

/**
 * Get the upcoming invoice
 * @param {Object} req
 * @param {Object} res
 */
exports.getUpcomingInvoice = async (req, res) => {
  try {
    // const userId = req.user.id;
    const userId = 1;
    const upcomingInvoice = await Invoice.findOne({
      where: { userId: userId, status: "upcoming" },
    });

    if (!upcomingInvoice) {
      return res.status(404).json({ message: "No upcoming invoice found" });
    }

    res
      .status(200)
      .json({ message: "Upcoming invoice", data: upcomingInvoice });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving upcoming invoice",
      error: error.message,
    });
  }
};

/**
 * Get user payments
 * @param {Object} req
 * @param {Object} res
 */
exports.getUserPayments = async (req, res) => {
  try {
    // const userId = req.user.id;
    const userId = 1;
    const payments = await Payment.findAll({ where: { userId: userId } });

    res.status(200).json({
      message: "User payments retrieved successfully",
      data: payments,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving user payments",
      error: error.message,
    });
  }
};

/**
 * Get all payments (admin access)
 * @param {Object} req
 * @param {Object} res
 */
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll();

    res
      .status(200)
      .json({ message: "All payments retrieved successfully", data: payments });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving payments", error: error.message });
  }
};
