const Application = require("../models/applicationModel");

// CREATE
exports.createApplication = async (req, res) => {
  try {
    const data = req.body;

    // prevent duplicate application #
    const exist = await Application.findOne({
      applicationNumber: data.applicationNumber.trim()
    });

    if (exist) {
      return res.status(400).json({
        message: "Application number already exists"
      });
    }

    const app = await Application.create(data);

    res.status(201).json({
      message: "Application saved successfully",
      data: app
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// GET ALL + SEARCH
exports.getApplications = async (req, res) => {
  try {
    const { applicationNumber, client, trademark, fileNumber } = req.query;

    let filter = {};

    if (applicationNumber) filter.applicationNumber = applicationNumber;
    if (fileNumber) filter.fileNumber = fileNumber;
    if (trademark) filter.trademark = new RegExp(trademark, "i");

    if (client) {
      filter.client = client; // frontend will send customerId
    }

    const apps = await Application.find(filter)
      .populate("client", "customerName")
      .populate("status", "description")
      .sort({ applicationNumber: 1 });

    res.status(200).json({
      count: apps.length,
      data: apps
    });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// UPDATE
exports.updateApplication = async (req, res) => {
  try {
    const updated = await Application.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({ message: "Application updated", data: updated });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// DELETE
exports.deleteApplication = async (req, res) => {
  try {
    await Application.findByIdAndDelete(req.params.id);
    res.json({ message: "Application deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
