const mongoose = require("mongoose");
const Application = require("../models/applicationModel");

/* ================= USER (READ ONLY) ================= */


exports.getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid application ID" });
    }

    const application = await Application.findById(id)
      .populate("client", "customerName")
      .populate("status", "description");

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // ✅ VIEW allowed for ALL authenticated users (single-customer system)

    return res.status(200).json({
      success: true,
      data: application
    });
  } catch (err) {
    console.error("GET APPLICATION BY ID ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET ALL APPLICATIONS FOR LOGGED-IN USER
 * GET /api/applications/my-applications
 */
exports.getMyApplications = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // ✅ SINGLE CUSTOMER MODE → show all applications
    const apps = await Application.find()
      .select("applicationNumber trademark classes status")
      .populate("status", "description")
      .sort({ applicationNumber: 1 });

    return res.status(200).json({
      success: true,
      count: apps.length,
      data: apps
    });
  } catch (err) {
    console.error("GET MY APPLICATIONS ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/* ================= ADMIN ================= */

/**
 * CREATE APPLICATION (ADMIN)
 */
exports.createApplication = async (req, res) => {
  try {
    const data = req.body;

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
        return res.status(400).json({ message: `${field} is required` });
      }
    }

    if (!mongoose.Types.ObjectId.isValid(data.client)) {
      return res.status(400).json({ message: "Invalid client ID" });
    }

    if (!Array.isArray(data.classes)) {
      return res.status(400).json({ message: "Classes must be an array" });
    }

    const exist = await Application.findOne({
      applicationNumber: data.applicationNumber.trim()
    });

    if (exist) {
      return res
        .status(400)
        .json({ message: "Application number already exists" });
    }

    const app = await Application.create(data);

    return res.status(201).json({
      success: true,
      message: "Application saved successfully",
      data: app
    });
  } catch (err) {
    console.error("CREATE APPLICATION ERROR:", err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * GET ALL APPLICATIONS (ADMIN)
 */
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

    return res.status(200).json({
      success: true,
      count: apps.length,
      data: apps
    });
  } catch (err) {
    console.error("GET APPLICATIONS ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * UPDATE APPLICATION (ADMIN)
 */
exports.updateApplication = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid application ID" });
    }

    const updated = await Application.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true
    });

    if (!updated) {
      return res.status(404).json({ message: "Application not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Application updated",
      data: updated
    });
  } catch (err) {
    console.error("UPDATE APPLICATION ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

/**
 * DELETE APPLICATION (ADMIN)
 */
exports.deleteApplication = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid application ID" });
    }

    await Application.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Application deleted"
    });
  } catch (err) {
    console.error("DELETE APPLICATION ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
