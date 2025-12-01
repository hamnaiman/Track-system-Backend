const TMForm = require("../models/tmFormModel");

// Create TM Form
exports.createTMForm = async (req, res) => {
  try {
    const { formNumber, description, priority } = req.body;

    if (!formNumber || !description || !priority) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const exists = await TMForm.findOne({ formNumber });
    if (exists) return res.status(400).json({ message: "Form already exists" });

    const form = await TMForm.create({ formNumber, description, priority });

    res.status(201).json({
      message: "Form created successfully",
      data: form
    });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all TM Forms (sorted alphabetically)
exports.getTMForms = async (req, res) => {
  try {
    const forms = await TMForm.find().sort({ formNumber: 1 });
    res.json(forms);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update TM Form
exports.updateTMForm = async (req, res) => {
  try {
    const updated = await TMForm.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({ message: "Form updated", data: updated });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete TM Form
exports.deleteTMForm = async (req, res) => {
  try {
    await TMForm.findByIdAndDelete(req.params.id);
    res.json({ message: "Form deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
