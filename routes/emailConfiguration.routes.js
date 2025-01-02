"use strict";

const express = require("express");
const router = express.Router();
const {
  createEmailConfiguration,
  getAllEmailConfigurations,
  getEmailConfigurationById,
  updateEmailConfiguration,
  deleteEmailConfiguration,
  updateStatus,
} = require("../controllers/emailConfiguration.controller");

router.post("/", createEmailConfiguration);
router.get("/", getAllEmailConfigurations);
router.get("/:id", getEmailConfigurationById);
router.put("/:id", updateEmailConfiguration);
router.delete("/:id", deleteEmailConfiguration);
router.put("/:id/status", updateStatus);

module.exports = router;
