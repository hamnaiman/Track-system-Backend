const TMForm = require("../models/tmFormModel");

// CREATE
exports.createTMForm = async (req, res) => {
  try {
    let { formNumber, description, priority } = req.body;

    formNumber = formNumber?.trim();
    description = description?.trim();
    priority = priority?.trim();

    if (!formNumber || !description || !priority) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!["Low", "Medium", "High"].includes(priority)) {
      return res.status(400).json({ message: "Invalid priority value" });
    }

    const exists = await TMForm.findOne({ formNumber });
    if (exists) {
      return res.status(409).json({ message: "Form already exists" });
    }

    const form = await TMForm.create({
      formNumber,
      description,
      priority
    });

    res.status(201).json({
      message: "Form created successfully",
      data: form
    });

  } catch (err) {
    console.error("TM FORM ERROR:", err.message);

    if (err.code === 11000) {
      return res.status(409).json({ message: "Form already exists" });
    }

    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};

// GET
exports.getTMForms = async (req, res) => {
  try {
    const forms = await TMForm.find().sort({ formNumber: 1 });
    res.json(forms);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE
exports.updateTMForm = async (req, res) => {
  try {
    const updated = await TMForm.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json({ message: "Form updated", data: updated });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// DELETE
exports.deleteTMForm = async (req, res) => {
  try {
    await TMForm.findByIdAndDelete(req.params.id);
    res.json({ message: "Form deleted" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};
