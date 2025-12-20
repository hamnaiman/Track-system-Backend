const mongoose = require("mongoose");
const Application = require("../models/applicationModel");

/* ================= USER ================= */
exports.getMyApplications = async (req, res) => {
  try {
    if (!req.user || !req.user.customerId) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    const apps = await Application.find({
      client: req.user.customerId
    })
      .select("applicationNumber trademark")
      .sort({ applicationNumber: 1 });

    res.status(200).json(apps);
  } catch (err) {
    console.error("GET MY APPS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= ADMIN ================= */

// CREATE
exports.createApplication = async (req, res) => {
  try {
    const data = req.body;

    // REQUIRED FIELD CHECK
    const requiredFields = [
      "applicationNumber",
      "fileNumber",
      "dateOfFiling",
      "wordOrLabel",
      "classes",
      "trademark",
      "client"
    ];

    for (let field of requiredFields) {
      if (!data[field]) {
        return res.status(400).json({
          message: `${field} is required`
        });
      }
    }

    // ObjectId validation
    if (!mongoose.Types.ObjectId.isValid(data.client)) {
      return res.status(400).json({
        message: "Invalid client ID"
      });
    }

    // Classes must be array
    if (!Array.isArray(data.classes)) {
      return res.status(400).json({
        message: "Classes must be an array"
      });
    }

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
      success: true,
      message: "Application saved successfully",
      data: app
    });
  } catch (err) {
    console.error("CREATE APPLICATION ERROR:", err);
    res.status(500).json({
      message: "Internal Server Error",
      error: err.message
    });
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
      if (!mongoose.Types.ObjectId.isValid(client)) {
        return res.status(400).json({ message: "Invalid client ID" });
      }
      filter.client = client;
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
    console.error("GET APPLICATIONS ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// UPDATE
exports.updateApplication = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid application ID" });
    }

    const updated = await Application.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Application not found" });
    }

    res.json({
      message: "Application updated",
      data: updated
    });
  } catch (err) {
    console.error("UPDATE APPLICATION ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE
exports.deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid application ID" });
    }

    await Application.findByIdAndDelete(id);

    res.json({ message: "Application deleted" });
  } catch (err) {
    console.error("DELETE APPLICATION ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};
