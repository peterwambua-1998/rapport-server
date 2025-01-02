const express = require("express");
const {
  createCountry,
  getAllCountries,
  getCountryByName,
  getCountryById,
  updateCountry,
  deleteCountry,
  updateStatus,
} = require("../controllers/country.controller");

const router = express.Router();

router.post("/", createCountry);
router.get("/", getAllCountries);
router.get("/:id", getCountryById);
router.get("/:name/search", getCountryByName);
router.put("/:id", updateCountry);
router.delete("/:id",deleteCountry);
router.patch("/:id/status", updateStatus);

module.exports = router;
