"use strict";
const { ProfileVisibility } = require("../models");

/**
 * Create a new Profile Visibility
 * @param {Object} req
 * @param {Object} res
 */
const createProfileVisibility = async (req, res) => {
  try {
    const { name, description } = req.body;
    const profileVisibility = await ProfileVisibility.create({ name, description });
    res.status(201).json({ message: "Profile Visibility created successfully", data: profileVisibility });
  } catch (error) {
    res.status(500).json({ message: "Error creating Profile Visibility", error: error.message });
  }
};

/**
 * Get all Profile Visibilities
 * @param {Object} req
 * @param {Object} res
 */
const getAllProfileVisibilitys = async (req, res) => {
  try {
    const profileVisibilities = await ProfileVisibility.findAll();
    res.status(200).json({ message: "Profile Visibilities retrieved successfully", data: profileVisibilities });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving Profile Visibilities", error: error.message });
  }
};

/**
 * Get a single Profile Visibility by ID
 * @param {Object} req
 * @param {Object} res
 */
const getProfileVisibilityById = async (req, res) => {
  try {
    const { id } = req.params;
    const profileVisibility = await ProfileVisibility.findByPk(id);

    if (!profileVisibility) {
      return res.status(404).json({ message: "Profile Visibility not found" });
    }

    res.status(200).json({ message: "Profile Visibility retrieved successfully", data: profileVisibility });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving Profile Visibility", error: error.message });
  }
};

/**
 * Update a Profile Visibility by ID
 * @param {Object} req
 * @param {Object} res
 */
const updateProfileVisibility = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const profileVisibility = await ProfileVisibility.findByPk(id);

    if (!profileVisibility) {
      return res.status(404).json({ message: "Profile Visibility not found" });
    }

    await profileVisibility.update({ name, description });
    res.status(200).json({ message: "Profile Visibility updated successfully", data: profileVisibility });
  } catch (error) {
    res.status(500).json({ message: "Error updating Profile Visibility", error: error.message });
  }
};

/**
 * Delete a Profile Visibility by ID
 * @param {Object} req
 * @param {Object} res
 */
const deleteProfileVisibility = async (req, res) => {
  try {
    const { id } = req.params;

    const profileVisibility = await ProfileVisibility.findByPk(id);

    if (!profileVisibility) {
      return res.status(404).json({ message: "Profile Visibility not found" });
    }

    await profileVisibility.destroy();
    res.status(200).json({ message: "Profile Visibility deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Profile Visibility", error: error.message });
  }
};

/**
 * Update the status of a Profile Visibility
 * @param {Object} req
 * @param {Object} res
 */
const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const profileVisibility = await ProfileVisibility.findByPk(id);

    if (!profileVisibility) {
      return res.status(404).json({ message: "Profile Visibility not found" });
    }

    await profileVisibility.update({ status });
    res.status(200).json({ message: "Profile Visibility status updated successfully", data: profileVisibility });
  } catch (error) {
    res.status(500).json({ message: "Error updating Profile Visibility status", error: error.message });
  }
};

module.exports = {
  createProfileVisibility,
  getAllProfileVisibilitys,
  getProfileVisibilityById,
  updateProfileVisibility,
  deleteProfileVisibility,
  updateStatus,
};
