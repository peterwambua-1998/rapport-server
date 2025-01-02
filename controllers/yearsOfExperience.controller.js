"use strict";
const { YearsOfExperience } = require("../models");

/**
 * Create a new YearsOfExperience
 */
const createYearsOfExperience = async (req, res) => {
  try {
    const { name, description, status } = req.body;
    const yearsOfExperience = await YearsOfExperience.create({
      name,
      description,
      status,
    });
    res
      .status(201)
      .json({
        message: "YearsOfExperience created successfully",
        data: yearsOfExperience,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error creating YearsOfExperience",
        error: error.message,
      });
  }
};

/**
 * Get all YearsOfExperience entries
 */
const getAllYearsOfExperience = async (req, res) => {
  try {
    const yearsOfExperience = await YearsOfExperience.findAll();
    res
      .status(200)
      .json({
        message: "YearsOfExperience retrieved successfully",
        data: yearsOfExperience,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error retrieving YearsOfExperience",
        error: error.message,
      });
  }
};

/**
 * Get a YearsOfExperience by ID
 */
const getYearsOfExperienceById = async (req, res) => {
  try {
    const { id } = req.params;
    const yearsOfExperience = await YearsOfExperience.findByPk(id);

    if (!yearsOfExperience) {
      return res.status(404).json({ message: "YearsOfExperience not found" });
    }

    res
      .status(200)
      .json({
        message: "YearsOfExperience retrieved successfully",
        data: yearsOfExperience,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error retrieving YearsOfExperience",
        error: error.message,
      });
  }
};

/**
 * Update a YearsOfExperience by ID
 */
const updateYearsOfExperience = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, status } = req.body;

    const yearsOfExperience = await YearsOfExperience.findByPk(id);

    if (!yearsOfExperience) {
      return res.status(404).json({ message: "YearsOfExperience not found" });
    }

    await yearsOfExperience.update({ name, description, status });
    res
      .status(200)
      .json({
        message: "YearsOfExperience updated successfully",
        data: yearsOfExperience,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error updating YearsOfExperience",
        error: error.message,
      });
  }
};

/**
 * Delete a YearsOfExperience by ID
 */
const deleteYearsOfExperience = async (req, res) => {
  try {
    const { id } = req.params;

    const yearsOfExperience = await YearsOfExperience.findByPk(id);

    if (!yearsOfExperience) {
      return res.status(404).json({ message: "YearsOfExperience not found" });
    }

    await yearsOfExperience.destroy();
    res.status(200).json({ message: "YearsOfExperience deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error deleting YearsOfExperience",
        error: error.message,
      });
  }
};

/**
 * Update the status of a YearsOfExperience by ID
 */
const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const yearsOfExperience = await YearsOfExperience.findByPk(id);

    if (!yearsOfExperience) {
      return res.status(404).json({ message: "YearsOfExperience not found" });
    }

    await yearsOfExperience.update({ status });
    res
      .status(200)
      .json({
        message: "YearsOfExperience status updated successfully",
        data: yearsOfExperience,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error updating YearsOfExperience status",
        error: error.message,
      });
  }
};

module.exports = {
  createYearsOfExperience,
  getAllYearsOfExperience,
  getYearsOfExperienceById,
  updateYearsOfExperience,
  deleteYearsOfExperience,
  updateStatus,
};
