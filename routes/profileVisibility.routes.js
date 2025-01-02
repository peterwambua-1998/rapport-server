"use strict";

const express = require("express");
const router = express.Router();
const {
  createProfileVisibility,
  getAllProfileVisibilitys,
  getProfileVisibilityById,
  updateProfileVisibility,
  deleteProfileVisibility,
  updateStatus,
} = require("../controllers/profileVisibility.controller");

router.post("/", createProfileVisibility);
router.get("/", getAllProfileVisibilitys);
router.get("/:id", getProfileVisibilityById);
router.put("/:id", updateProfileVisibility);
router.delete("/:id", deleteProfileVisibility);
router.put("/:id/status", updateStatus);

module.exports = router;
