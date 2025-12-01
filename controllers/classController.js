const Class = require("../models/classModel");

// Create class
exports.createClass = async (req, res) => {
  try {
    const { classNumber, description } = req.body;

    if (!classNumber || !description) {
      return res.status(400).json({ message: "Class number & description required" });
    }

    const existing = await Class.findOne({ classNumber });
    if (existing) {
      return res.status(400).json({ message: "Class already exists" });
    }

    const newClass = await Class.create({ classNumber, description });

    res.status(201).json({
      message: "Class added successfully",
      data: newClass
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all classes sorted numeric
exports.getClasses = async (req, res) => {
  try {
    const classes = await Class.find().sort({ classNumber: 1 });
    res.json(classes);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update class
exports.updateClass = async (req, res) => {
  try {
    const { classNumber, description } = req.body;

    const updated = await Class.findByIdAndUpdate(
      req.params.id,
      { classNumber, description },
      { new: true }
    );

    res.json({ message: "Class updated", data: updated });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete class
exports.deleteClass = async (req, res) => {
  try {
    await Class.findByIdAndDelete(req.params.id);
    res.json({ message: "Class deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
