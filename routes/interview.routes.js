const express = require("express");
const router = express.Router();
const interviewController = require("../controllers/interview.controller");

// router.post("/", interviewController.createIndustry);
router.get("/questions", interviewController.getQuestions);
// router.get("/:id", interviewController.getIndustryById);
// router.put("/:id", interviewController.updateIndustry);
// router.delete("/:id", interviewController.deleteIndustry);
// router.patch("/:id/status", interviewController.updateStatus);

module.exports = router;
