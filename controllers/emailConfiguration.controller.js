"use strict";
const { EmailConfiguration } = require("../models");

/**
 * Create a new Email Configuration
 * @param {Object} req
 * @param {Object} res
 */
const createEmailConfiguration = async (req, res) => {
  try {
    const { host, port, secure, user, password, from } = req.body;
    const emailConfiguration = await EmailConfiguration.create({ host, port, secure, user, password, from, status:0 });
    res.status(201).json({ message: "Email Configuration created successfully", data: emailConfiguration });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Error creating Email Configuration", error: error.message });
  }
};

/**
 * Get all Email Configurations
 * @param {Object} req
 * @param {Object} res
 */
const getAllEmailConfigurations = async (req, res) => {
  try {
    const emailConfigurations = await EmailConfiguration.findAll();
    res.status(200).json({ message: "Email Configurations retrieved successfully", data: emailConfigurations });
  } catch (error) {

    res.status(500).json({ message: "Error retrieving Email Configurations", error: error.message });
  }
};

/**
 * Get a single Email Configuration by ID
 * @param {Object} req
 * @param {Object} res
 */
const getEmailConfigurationById = async (req, res) => {
  try {
    const { id } = req.params;
    const emailConfiguration = await EmailConfiguration.findByPk(id);

    if (!emailConfiguration) {
      return res.status(404).json({ message: "Email Configuration not found" });
    }

    res.status(200).json({ message: "Email Configuration retrieved successfully", data: emailConfiguration });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving Email Configuration", error: error.message });
  }
};

/**
 * Update a Email Configuration by ID
 * @param {Object} req
 * @param {Object} res
 */
const updateEmailConfiguration = async (req, res) => {
  try {
    const { id } = req.params;
    const { host, port, secure, user, password, from } = req.body;


    const emailConfiguration = await EmailConfiguration.findByPk(id);

    if (!emailConfiguration) {
      return res.status(404).json({ message: "Email Configuration not found" });
    }

    await emailConfiguration.update({ host, port, secure, user, password, from });
    res.status(200).json({ message: "Email Configuration updated successfully", data: emailConfiguration });
  } catch (error) {
    res.status(500).json({ message: "Error updating Email Configuration", error: error.message });
  }
};

/**
 * Delete a Email Configuration by ID
 * @param {Object} req
 * @param {Object} res
 */
const deleteEmailConfiguration = async (req, res) => {
  try {
    const { id } = req.params;

    const emailConfiguration = await EmailConfiguration.findByPk(id);

    if (!emailConfiguration) {
      return res.status(404).json({ message: "Email Configuration not found" });
    }

    await emailConfiguration.destroy();
    res.status(200).json({ message: "Email Configuration deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting Email Configuration", error: error.message });
  }
};

/**
 * Update the status of a Email Configuration
 * @param {Object} req
 * @param {Object} res
 */
const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const emailConfiguration = await EmailConfiguration.findByPk(id);

    if (!emailConfiguration) {
      return res.status(404).json({ message: "Email Configuration not found" });
    }

    if (status === 1) {
      await EmailConfiguration.update({ status: 0 }, { where: {} });
    }
 
    await emailConfiguration.update({ status });
    res.status(200).json({ message: "Email Configuration status updated successfully", data: emailConfiguration });
  } catch (error) {
    res.status(500).json({ message: "Error updating Email Configuration status", error: error.message });
  }
};

module.exports = {
  createEmailConfiguration,
  getAllEmailConfigurations,
  getEmailConfigurationById,
  updateEmailConfiguration,
  deleteEmailConfiguration,
  updateStatus,
};
