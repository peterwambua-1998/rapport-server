const express = require("express");
const router = express.Router();
const { getQuestions, storeQuestions } = require("../controllers/interview.controller");
const interviewQuestionMiddleware = require("../middleware/interviewQuestionMiddleware");

// router.post("/", interviewController.createIndustry);
router.get("/questions", getQuestions);
router.post('/upload-interview', interviewQuestionMiddleware, storeQuestions);
// router.get("/:id", interviewController.getIndustryById);
// router.put("/:id", interviewController.updateIndustry);
// router.delete("/:id", interviewController.deleteIndustry);
// router.patch("/:id/status", interviewController.updateStatus);

module.exports = router;
