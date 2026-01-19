const FileStatus = require("../models/fileStatusModel");

// CREATE
exports.createFileStatus = async (req, res) => {
  try {
    const { description } = req.body;

    if (!description) {
      return res.status(400).json({ message: "Description is required" });
    }

    const exists = await FileStatus.findOne({ description: description.trim() });
    if (exists) {
      return res.status(400).json({ message: "Status already exists" });
    }

    const status = await FileStatus.create({ description: description.trim() });

    res.status(201).json({
      message: "Status added successfully",
      data: status
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET ALL
exports.getFileStatuses = async (req, res) => {
  try {
    const statuses = await FileStatus.find().sort({ description: 1 });
    res.json(statuses);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE
exports.updateFileStatus = async (req, res) => {
  try {
    const { description } = req.body;
    const updated = await FileStatus.findByIdAndUpdate(
      req.params.id,
      { description: description.trim() },
      { new: true }
    );
    res.json({ message: "Status updated", data: updated });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// DELETE
exports.deleteFileStatus = async (req, res) => {
  try {
    await FileStatus.findByIdAndDelete(req.params.id);
    res.json({ message: "Status deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
