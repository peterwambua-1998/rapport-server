"use strict";
const { Company, CompanyVerificationStatus } = require("../models");

/**
 * Create a new company   
 * @param {Object} req
 * @param {Object} res
 */
const createCompany = async (req, res) => {
  try {
    const { name, description } = req.body;

    const company = await Company.create({
      name,
      description,
      logo: req.file ? req.file.path : '',
    });
    res
      .status(201)
      .json({ message: "Company created successfully", data: company });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating company", error: error.message });
  }
};

/**
 * Get all companies
 * @param {Object} req
 * @param {Object} res
 */
const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.findAll();
    res
      .status(200)
      .json({ message: "Companies retrieved successfully", data: companies });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving companies", error: error.message });
  }
};

/**
 * Get a single company by ID
 * @param {Object} req
 * @param {Object} res
 */
const getCompanyByName = async (req, res) => {
  try {
    const { name } = req.params;

    const company = await Company.findAll({ where: { name: name } });

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res
      .status(200)
      .json({ message: "Company retrieved successfully", data: company });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving company", error: error.message });
  }
};

/**
 * Get a single company by ID
 * @param {Object} req
 * @param {Object} res
 */
const getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await Company.findByPk(id);

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res
      .status(200)
      .json({ message: "Company retrieved successfully", data: company });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving company", error: error.message });
  }
};

/**
 * Update a company by ID
 * @param {Object} req
 * @param {Object} res
 */
const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, logo } = req.body;

    const company = await Company.findByPk(id);

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    await company.update({ name, description, logo });
    res
      .status(200)
      .json({ message: "Company updated successfully", data: company });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating company", error: error.message });
  }
};

/**
 * Delete a company by ID
 * @param {Object} req
 * @param {Object} res
 */
const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;

    const company = await Company.findByPk(id);

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    await company.destroy();
    res.status(200).json({ message: "Company deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting company", error: error.message });
  }
};

/**
 * Update the status of a company
 * @param {Object} req
 * @param {Object} res
 */
const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { newStatus } = req.body;

    const company = await Company.findByPk(id);

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    await company.update({ status: newStatus });
    res
      .status(200)
      .json({ message: "Company status updated successfully", data: company });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating company status", error: error.message });
  }
};


const verifyCompany = async (req, res) => {
  try {
    const { newStatus, remarks } = req.body;

    const profile = await Company.update(
      {
        is_verified: newStatus ? 1 : 0,
      },
      {
        where: {
          id: req.params.id,
        },
      }
    );


    await CompanyVerificationStatus.create({
      companyId: req.params.id,
      status: `${newStatus}`,
      remarks: remarks,
    });
    return res.status(200).json(profile);
  } catch (error) {
    console.log(error)
    console.error("Error fetching recruiter profiles:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createCompany,
  getAllCompanies,
  getCompanyByName,
  getCompanyById,
  updateCompany,
  deleteCompany,
  updateStatus,
  verifyCompany
};
