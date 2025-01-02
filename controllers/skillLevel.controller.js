"use strict";
const { SkillLevel } = require("../models");

/**
 * Create a new SkillLevel
 */
const createSkillLevel = async (req, res) => {
  try {
    const { name, description, status } = req.body;
    const skillLevel = await SkillLevel.create({ name, description, status });
    res
      .status(201)
      .json({ message: "SkillLevel created successfully", data: skillLevel });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating SkillLevel", error: error.message });
  }
};

/**
 * Get all SkillLevels
 */
const getAllSkillLevels = async (req, res) => {
  try {
    const skillLevels = await SkillLevel.findAll();
    res
      .status(200)
      .json({
        message: "SkillLevels retrieved successfully",
        data: skillLevels,
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving SkillLevels", error: error.message });
  }
};

/**
 * Get a SkillLevel by ID
 */
const getSkillLevelById = async (req, res) => {
  try {
    const { id } = req.params;
    const skillLevel = await SkillLevel.findByPk(id);

    if (!skillLevel) {
      return res.status(404).json({ message: "SkillLevel not found" });
    }

    res
      .status(200)
      .json({ message: "SkillLevel retrieved successfully", data: skillLevel });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving SkillLevel", error: error.message });
  }
};

/**
 * Update a SkillLevel by ID
 */
const updateSkillLevel = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, status } = req.body;

    const skillLevel = await SkillLevel.findByPk(id);

    if (!skillLevel) {
      return res.status(404).json({ message: "SkillLevel not found" });
    }

    await skillLevel.update({ name, description, status });
    res
      .status(200)
      .json({ message: "SkillLevel updated successfully", data: skillLevel });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating SkillLevel", error: error.message });
  }
};

/**
 * Delete a SkillLevel by ID
 */
const deleteSkillLevel = async (req, res) => {
  try {
    const { id } = req.params;

    const skillLevel = await SkillLevel.findByPk(id);

    if (!skillLevel) {
      return res.status(404).json({ message: "SkillLevel not found" });
    }

    await skillLevel.destroy();
    res.status(200).json({ message: "SkillLevel deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting SkillLevel", error: error.message });
  }
};

/**
 * Update the status of a SkillLevel by ID
 */
const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const skillLevel = await SkillLevel.findByPk(id);

    if (!skillLevel) {
      return res.status(404).json({ message: "SkillLevel not found" });
    }

    await skillLevel.update({ status });
    res
      .status(200)
      .json({
        message: "SkillLevel status updated successfully",
        data: skillLevel,
      });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Error updating SkillLevel status",
        error: error.message,
      });
  }
};

module.exports = {
  createSkillLevel,
  getAllSkillLevels,
  getSkillLevelById,
  updateSkillLevel,
  deleteSkillLevel,
  updateStatus,
};
