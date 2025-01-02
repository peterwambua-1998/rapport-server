"use strict";
const { Skill } = require("../models");

/**
 * Create a new skill
 * @param {Object} req
 * @param {Object} res
 */
const createSkill = async (req, res) => {
  try {
    const { name, description } = req.body;
    const skill = await Skill.create({ name, description });
    res.status(201).json({ message: "Skill created successfully", data: skill });
  } catch (error) {
    res.status(500).json({ message: "Error creating skill", error: error.message });
  }
};

/**
 * Get all skills
 * @param {Object} req
 * @param {Object} res
 */
const getAllSkills = async (req, res) => {
  try {
    const skills = await Skill.findAll();
    res.status(200).json({ message: "Skills retrieved successfully", data: skills });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving skills", error: error.message });
  }
};

/**
 * Get a single skill by ID
 * @param {Object} req
 * @param {Object} res
 */
const getSkillById = async (req, res) => {
  try {
    const { id } = req.params;
    const skill = await Skill.findByPk(id);

    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    res.status(200).json({ message: "Skill retrieved successfully", data: skill });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving skill", error: error.message });
  }
};

/**
 * Update a skill by ID
 * @param {Object} req
 * @param {Object} res
 */
const updateSkill = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const skill = await Skill.findByPk(id);

    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    await skill.update({ name, description });
    res.status(200).json({ message: "Skill updated successfully", data: skill });
  } catch (error) {
    res.status(500).json({ message: "Error updating skill", error: error.message });
  }
};

/**
 * Delete a skill by ID
 * @param {Object} req
 * @param {Object} res
 */
const deleteSkill = async (req, res) => {
  try {
    const { id } = req.params;

    const skill = await Skill.findByPk(id);

    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    await skill.destroy();
    res.status(200).json({ message: "Skill deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting skill", error: error.message });
  }
};

/**
 * Update the status of a skill
 * @param {Object} req
 * @param {Object} res
 */
const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const skill = await Skill.findByPk(id);

    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    await skill.update({ status });
    res.status(200).json({ message: "Skill status updated successfully", data: skill });
  } catch (error) {
    res.status(500).json({ message: "Error updating skill status", error: error.message });
  }
};

module.exports = {
  createSkill,
  getAllSkills,
  getSkillById,
  updateSkill,
  deleteSkill,
  updateStatus,
};
