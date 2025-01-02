const express = require("express");
const planController = require("../controllers/plan.controller");
const router = express.Router();

router.get("/", planController.getAllPlans);
router.post("/", planController.createPlan);
router.get("/:id", planController.getPlan);
router.put("/:id", planController.updatePlan);
router.delete("/:id", planController.deletePlan);
router.put("/:id/status", planController.updatePlanStatus);  
router.put("/:id/features", planController.updatePlanFeatures);

module.exports = router;
