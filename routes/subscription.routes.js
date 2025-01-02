const express = require("express");
const subscriptionController = require("../controllers/subscription.controller");
const router = express.Router();

router.post("/subscribe", subscriptionController.subscribeToPlan);
router.post(
  "/:subscriptionId/cancel",
  subscriptionController.cancelSubscription
);

router.post("/change-plan", subscriptionController.changePlan);
router.get("/active", subscriptionController.getActiveSubscription);
router.get("/", subscriptionController.getSubscriptionHistory);
router.post("/renew/:subscriptionId", subscriptionController.renewSubscription);
router.post("/pause/:subscriptionId", subscriptionController.pauseSubscription);

router.post(
  "/resume/:subscriptionId",
  subscriptionController.resumeSubscription
);

// Invoice related routes
router.get("/invoices", subscriptionController.getInvoices);
router.get("/upcoming-invoice", subscriptionController.getUpcomingInvoice);

router.get("/payments", subscriptionController.getUserPayments);
router.get("/all-payments", subscriptionController.getAllPayments);

module.exports = router;
