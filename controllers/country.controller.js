"use strict";
const { Country } = require("../models");

/**
 * Create a new Country
 * @param {Object} req
 * @param {Object} res
 */
const createCountry = async (req, res) => {
  try {
    const { name, logo, description } = req.body;
    const country = await Country.create({
      name, 
      description,
      logo,
    });
    res
      .status(201)
      .json({ message: "Country created successfully", data: country });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating country", error: error.message });
  }
};

/**
 * Get all countries
 * @param {Object} req
 * @param {Object} res
 */
const getAllCountries = async (req, res) => {
  try {
    const countries = await Country.findAll();
    res
      .status(200)
      .json({ message: "Countries retrieved successfully", data: countries });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving countries", error: error.message });
  }
};

/**
 * Get a single country by ID
 * @param {Object} req
 * @param {Object} res
 */
const getCountryByName = async (req, res) => {
  try { 
    const { name } = req.params;

    const Country = await Country.findAll({ where: { name: name} });

    if (!Country) {
      return res.status(404).json({ message: "Country not found" });
    }

    res
      .status(200)
      .json({ message: "Country retrieved successfully", data: Country });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving Country", error: error.message });
  }
};
 
/**
 * Get a single country by ID
 * @param {Object} req
 * @param {Object} res
 */
const getCountryById = async (req, res) => {
  try {
    const { id } = req.params;
    const country = await Country.findByPk(id);

    if (!country) {
      return res.status(404).json({ message: "Country not found" });
    }

    res
      .status(200)
      .json({ message: "Country retrieved successfully", data: country });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving country", error: error.message });
  }
};

/**
 * Update a Country by ID
 * @param {Object} req
 * @param {Object} res
 */
const updateCountry = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, logo } = req.body;

    const Country = await Country.findByPk(id);

    if (!Country) {
      return res.status(404).json({ message: "Country not found" });
    }

    await Country.update({ name, description, logo });
    res
      .status(200)
      .json({ message: "Country updated successfully", data: Country });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating Country", error: error.message });
  }
};

/**
 * Delete a Country by ID
 * @param {Object} req
 * @param {Object} res
 */
const deleteCountry = async (req, res) => {
  try {
    const { id } = req.params;

    const Country = await Country.findByPk(id);

    if (!Country) {
      return res.status(404).json({ message: "Country not found" });
    }

    await Country.destroy();
    res.status(200).json({ message: "Country deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting Country", error: error.message });
  }
};

/**
 * Update the status of a Country
 * @param {Object} req
 * @param {Object} res
 */
const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const Country = await Country.findByPk(id);

    if (!Country) {
      return res.status(404).json({ message: "Country not found" });
    }

    await Country.update({ status });
    res
      .status(200)
      .json({ message: "Country status updated successfully", data: Country });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating Country status", error: error.message });
  }
};

module.exports = {
  createCountry,
  getAllCountries,
  getCountryByName,
  getCountryById,
  updateCountry,
  deleteCountry,
  updateStatus,
};
