"use strict";

const express = require("express");
const router = express.Router();
const {
  createEmailTemplate,
  getAllEmailTemplates,
  getEmailTemplateById,
  updateEmailTemplate,
  deleteEmailTemplate,
  updateStatus,
} = require("../controllers/emailTemplate.controller");

router.post("/", createEmailTemplate);
router.get("/", getAllEmailTemplates);
router.get("/:id", getEmailTemplateById);
router.put("/:id", updateEmailTemplate);
router.delete("/:id", deleteEmailTemplate);
router.put("/:id/status", updateStatus);

module.exports = router;
