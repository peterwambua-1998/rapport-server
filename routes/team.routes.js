const express = require("express");
const { getTeam } = require("../controllers/team.controller");

const router = express.Router();

router.get("/", getTeam);

module.exports = router;
