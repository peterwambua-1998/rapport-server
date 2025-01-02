const express = require("express");
const router = express.Router();
const yearsOfExperienceController = require("../controllers/yearsOfExperience.controller");

router.post("/", yearsOfExperienceController.createYearsOfExperience);
router.get("/", yearsOfExperienceController.getAllYearsOfExperience);
router.get("/:id", yearsOfExperienceController.getYearsOfExperienceById);
router.put("/:id", yearsOfExperienceController.updateYearsOfExperience);
router.delete("/:id", yearsOfExperienceController.deleteYearsOfExperience);
router.patch("/:id/status", yearsOfExperienceController.updateStatus);

module.exports = router;
