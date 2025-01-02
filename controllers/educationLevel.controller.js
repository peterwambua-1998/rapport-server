"use strict";
const { EducationLevel } = require("../models");

/**
 * Create a new EducationLevel
 */
const createEducationLevel = async (req, res) => {
  try {
    const { name, description, status } = req.body;
    const educationLevel = await EducationLevel.create({
      name,
      description,
      status,
    });
    res
      .status(201)
      .json({
        message: "EducationLevel created successfully",
        data: educationLevel,
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating EducationLevel", error: error.message });
  }
};

/**
 * Get all EducationLevels
 */
const getAllEducationLevels = async (req, res) => {
  try {
    const educationLevels = await EducationLevel.findAll();
    res
      .status(200)
      .json({
        message: "EducationLevels retrieved successfully",
        data: educationLevels,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error retrieving EducationLevels",
        error: error.message,
      });
  }
};

/**
 * Get a single EducationLevel by ID
 */
const getEducationLevelById = async (req, res) => {
  try {
    const { id } = req.params;
    const educationLevel = await EducationLevel.findByPk(id);

    if (!educationLevel) {
      return res.status(404).json({ message: "EducationLevel not found" });
    }

    res
      .status(200)
      .json({
        message: "EducationLevel retrieved successfully",
        data: educationLevel,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error retrieving EducationLevel",
        error: error.message,
      });
  }
};

/**
 * Update an EducationLevel by ID
 */
const updateEducationLevel = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, status } = req.body;

    const educationLevel = await EducationLevel.findByPk(id);

    if (!educationLevel) {
      return res.status(404).json({ message: "EducationLevel not found" });
    }

    await educationLevel.update({ name, description, status });
    res
      .status(200)
      .json({
        message: "EducationLevel updated successfully",
        data: educationLevel,
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating EducationLevel", error: error.message });
  }
};

/**
 * Delete an EducationLevel by ID
 */
const deleteEducationLevel = async (req, res) => {
  try {
    const { id } = req.params;

    const educationLevel = await EducationLevel.findByPk(id);

    if (!educationLevel) {
      return res.status(404).json({ message: "EducationLevel not found" });
    }

    await educationLevel.destroy();
    res.status(200).json({ message: "EducationLevel deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting EducationLevel", error: error.message });
  }
};

/**
 * Update the status of an EducationLevel by ID
 */
const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const educationLevel = await EducationLevel.findByPk(id);

    if (!educationLevel) {
      return res.status(404).json({ message: "EducationLevel not found" });
    }

    await educationLevel.update({ status });
    res
      .status(200)
      .json({
        message: "EducationLevel status updated successfully",
        data: educationLevel,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error updating EducationLevel status",
        error: error.message,
      });
  }
};

module.exports = {
  createEducationLevel,
  getAllEducationLevels,
  getEducationLevelById,
  updateEducationLevel,
  deleteEducationLevel,
  updateStatus,
};
