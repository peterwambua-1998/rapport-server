const express = require("express");
const router = express.Router();
const industryController = require("../controllers/industry.controller");

router.post("/", industryController.createIndustry);
router.get("/", industryController.getAllIndustries);
router.get("/:id", industryController.getIndustryById);
router.put("/:id", industryController.updateIndustry);
router.delete("/:id", industryController.deleteIndustry);
router.patch("/:id/status", industryController.updateStatus);

module.exports = router;
