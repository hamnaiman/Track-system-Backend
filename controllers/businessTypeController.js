const BusinessType = require("../models/businessTypeModel");

// ADD Business Type
exports.createBusinessType = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Business type name is required" });
    }

    const existing = await BusinessType.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({ message: "Business type already exists" });
    }

    const type = await BusinessType.create({ name: name.trim() });

    res.status(201).json({
      message: "Business type added successfully",
      data: type
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET all business types (sorted alphabetically)
exports.getBusinessTypes = async (req, res) => {
  try {
    const types = await BusinessType.find().sort({ name: 1 });
    res.json(types);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE Business Type
exports.updateBusinessType = async (req, res) => {
  try {
    const { name } = req.body;

    const updated = await BusinessType.findByIdAndUpdate(
      req.params.id,
      { name: name.trim() },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Business type not found" });

    res.json({
      message: "Business type updated successfully",
      data: updated
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// DELETE Business Type
exports.deleteBusinessType = async (req, res) => {
  try {
    await BusinessType.findByIdAndDelete(req.params.id);
    res.json({ message: "Business type deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
