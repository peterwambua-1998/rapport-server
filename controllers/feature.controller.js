const { Feature } = require("../models"); // Adjust the path to your models folder

// Create a new feature
exports.createFeature = async (req, res) => {
  try {
    const { name, description, type, value, unit, createdBy } = req.body;

    const newFeature = await Feature.create({
      name,
      description,
      type,
      value,
      unit,
      createdBy,
    });

    res
      .status(201)
      .json({ message: "Feature created successfully", feature: newFeature });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create feature" });
  }
};

// Get all features
exports.getAllFeatures = async (req, res) => {
  try {
    const features = await Feature.findAll();
    res.status(200).json(features);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch features" });
  }
};

// Get a single feature by ID
exports.getFeatureById = async (req, res) => {
  try {
    const { id } = req.params;
    const feature = await Feature.findByPk(id);

    if (!feature) {
      return res.status(404).json({ error: "Feature not found" });
    }

    res.status(200).json(feature);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch feature" });
  }
};

// Update a feature
exports.updateFeature = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, type, value, unit, isActive } = req.body;

    const feature = await Feature.findByPk(id);

    if (!feature) {
      return res.status(404).json({ error: "Feature not found" });
    }

    await feature.update({ name, description, type, value, unit, isActive });

    res.status(200).json({ message: "Feature updated successfully", feature });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update feature" });
  }
};

// Delete a feature
exports.deleteFeature = async (req, res) => {
  try {
    const { id } = req.params;

    const feature = await Feature.findByPk(id);

    if (!feature) {
      return res.status(404).json({ error: "Feature not found" });
    }

    await feature.destroy();

    res.status(200).json({ message: "Feature deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete feature" });
  }
};

// Toggle isActive status
exports.toggleFeatureStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const feature = await Feature.findByPk(id);

    if (!feature) {
      return res.status(404).json({ error: "Feature not found" });
    }

    const updatedFeature = await feature.update({
      isActive: !feature.isActive,
    });

    res
      .status(200)
      .json({
        message: "Feature status updated successfully",
        feature: updatedFeature,
      });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update feature status" });
  }
};
