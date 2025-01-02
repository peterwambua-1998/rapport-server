"use strict";
const { Industry } = require("../models");

/**
 * Create a new Industry
 */
const createIndustry = async (req, res) => {
  try {
    const { name, description, status } = req.body;
    const industry = await Industry.create({ name, description, status });
    res
      .status(201)
      .json({ message: "Industry created successfully", data: industry });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating Industry", error: error.message });
  }
};

/**
 * Get all Industries
 */
const getAllIndustries = async (req, res) => {
  try {
    const industries = await Industry.findAll();
    res
      .status(200)
      .json({ message: "Industries retrieved successfully", data: industries });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving Industries", error: error.message });
  }
};

/**
 * Get a single Industry by ID
 */
const getIndustryById = async (req, res) => {
  try {
    const { id } = req.params;
    const industry = await Industry.findByPk(id);

    if (!industry) {
      return res.status(404).json({ message: "Industry not found" });
    }

    res
      .status(200)
      .json({ message: "Industry retrieved successfully", data: industry });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving Industry", error: error.message });
  }
};

/**
 * Update an Industry by ID
 */
const updateIndustry = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, status } = req.body;

    const industry = await Industry.findByPk(id);

    if (!industry) {
      return res.status(404).json({ message: "Industry not found" });
    }

    await industry.update({ name, description, status });
    res
      .status(200)
      .json({ message: "Industry updated successfully", data: industry });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating Industry", error: error.message });
  }
};

/**
 * Delete an Industry by ID
 */
const deleteIndustry = async (req, res) => {
  try {
    const { id } = req.params;

    const industry = await Industry.findByPk(id);

    if (!industry) {
      return res.status(404).json({ message: "Industry not found" });
    }

    await industry.destroy();
    res.status(200).json({ message: "Industry deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting Industry", error: error.message });
  }
};

/**
 * Update the status of an Industry by ID
 */
const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const industry = await Industry.findByPk(id);

    if (!industry) {
      return res.status(404).json({ message: "Industry not found" });
    }

    await industry.update({ status });
    res
      .status(200)
      .json({
        message: "Industry status updated successfully",
        data: industry,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error updating Industry status",
        error: error.message,
      });
  }
};

module.exports = {
  createIndustry,
  getAllIndustries,
  getIndustryById,
  updateIndustry,
  deleteIndustry,
  updateStatus,
};
