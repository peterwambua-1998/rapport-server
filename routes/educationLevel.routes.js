const express = require("express");
const router = express.Router();
const educationLevelController = require("../controllers/educationLevel.controller");

router.post("/", educationLevelController.createEducationLevel);
router.get("/", educationLevelController.getAllEducationLevels);
router.get("/:id", educationLevelController.getEducationLevelById);
router.put("/:id", educationLevelController.updateEducationLevel);
router.delete("/:id", educationLevelController.deleteEducationLevel);
router.patch("/:id/status", educationLevelController.updateStatus);

module.exports = router;
