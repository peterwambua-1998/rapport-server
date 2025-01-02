"use strict";

const express = require("express");
const router = express.Router();
const {
  createSkill,
  getAllSkills,
  getSkillById,
  updateSkill,
  deleteSkill,
  updateStatus,
} = require("../controllers/skill.controller");

router.post("/", createSkill);
router.get("/", getAllSkills);
router.get("/:id", getSkillById);
router.put("/:id", updateSkill);
router.delete("/:id", deleteSkill);
router.put("/:id/status", updateStatus);

module.exports = router;
