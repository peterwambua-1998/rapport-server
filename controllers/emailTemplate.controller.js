"use strict";
const { EmailTemplate } = require("../models");

/**
 * Create a new Email Template
 * @param {Object} req
 * @param {Object} res
 */
const createEmailTemplate = async (req, res) => {
  try {
    const { type, subject, body } = req.body;
    const emailTemplates = await EmailTemplate.create({ type, subject, body });
    res.status(201).json({ message: "Email Template created successfully", data: emailTemplates });
  } catch (error) {
    res.status(500).json({ message: "Error creating Email Template", error: error.message });
  }
};

/**
 * Get all email Templates
 * @param {Object} req
 * @param {Object} res
 */
const getAllEmailTemplates = async (req, res) => {
  try {
    const emailTemplates = await EmailTemplate.findAll();
    res.status(200).json({ message: "Email Templates retrieved successfully", data: emailTemplates });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving Email Templates", error: error.message });
  }
};

/**
 * Get a single email Templates by ID
 * @param {Object} req
 * @param {Object} res
 */
const getEmailTemplateById = async (req, res) => {
  try {
    const { id } = req.params;
    const emailTemplate = await EmailTemplate.findByPk(id);

    if (!emailTemplate) {
      return res.status(404).json({ message: "Email Template not found" });
    }

    res.status(200).json({ message: "Email Template retrieved successfully", data: emailTemplate });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving Email Template", error: error.message });
  }
};

/**
 * Update a Email Template by ID
 * @param {Object} req
 * @param {Object} res
 */
const updateEmailTemplate = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, subject, body } = req.body;

    const emailTemplate = await EmailTemplate.findByPk(id);

    if (!emailTemplate) {
      return res.status(404).json({ message: "Email template not found" });
    }

    await emailTemplate.update({ type, subject, body });
    res.status(200).json({ message: "Email Template updated successfully", data: emailTemplate });
  } catch (error) {
    res.status(500).json({ message: "Error updating Email Template", error: error.message });
  }
};

/**
 * Delete a Email Template by ID
 * @param {Object} req
 * @param {Object} res
 */
const deleteEmailTemplate = async (req, res) => {
  try {
    const { id } = req.params;

    const emailTemplate = await EmailTemplate.findByPk(id);

    if (!emailTemplate) {
      return res.status(404).json({ message: "Email Template not found" });
    }

    await emailTemplate.destroy();
    res.status(200).json({ message: "Email Template deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Email Template", error: error.message });
  }
};

/**
 * Update the status of a Email Template
 * @param {Object} req
 * @param {Object} res
 */
const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const emailTemplate = await EmailTemplate.findByPk(id);

    if (!emailTemplate) {
      return res.status(404).json({ message: "Email Template not found" });
    }

    await emailTemplate.update({ status });
    res.status(200).json({ message: "Email Template status updated successfully", data: emailTemplate });
  } catch (error) {
    res.status(500).json({ message: "Error updating Email Template status", error: error.message });
  }
};

module.exports = {
  createEmailTemplate,
  getAllEmailTemplates,
  getEmailTemplateById,
  updateEmailTemplate,
  deleteEmailTemplate,
  updateStatus,
};
