const express = require("express");
const router = express.Router();
const skillLevelController = require("../controllers/skillLevel.controller");

router.post("/", skillLevelController.createSkillLevel);
router.get("/", skillLevelController.getAllSkillLevels);
router.get("/:id", skillLevelController.getSkillLevelById);
router.put("/:id", skillLevelController.updateSkillLevel);
router.delete("/:id", skillLevelController.deleteSkillLevel);
router.patch("/:id/status", skillLevelController.updateStatus);

module.exports = router;
