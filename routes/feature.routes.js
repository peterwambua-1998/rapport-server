const express = require("express");
const featureController = require("../controllers/feature.controller");

const router = express.Router();

router.post("/", featureController.createFeature);
router.get("/", featureController.getAllFeatures);
router.get("/:id", featureController.getFeatureById);
router.put("/:id", featureController.updateFeature);
router.delete("/:id", featureController.deleteFeature);
router.patch("/:id/status", featureController.toggleFeatureStatus);

module.exports = router;
