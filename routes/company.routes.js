const express = require("express");
const {
  createCompany,
  getAllCompanies,
  getCompanyByName,
  getCompanyById,
  updateCompany,
  deleteCompany,
  updateStatus,
  verifyCompany
} = require("../controllers/company.controller");
const uploadImageMiddleware = require('../middleware/uploadImageMiddleware');

const router = express.Router();

router.post("/", uploadImageMiddleware, createCompany);
router.get("/", getAllCompanies);
router.get("/:id", getCompanyById);
router.get("/:name/search", getCompanyByName);
router.put("/:id", updateCompany);
router.delete("/:id", deleteCompany);
router.put("/:id/status", updateStatus);
router.put("/:id/verify", verifyCompany);
module.exports = router;
