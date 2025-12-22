const mongoose = require("mongoose");
const Application = require("../models/applicationModel");

/* ================= USER ================= */
/**
 * GET /api/applications/my-applications
 * Logged-in user apni applications dekhega
 */
exports.getMyApplications = async (req, res) => {
  try {
    // 🔐 authMiddleware se aa raha hai
    const customerCode = req.user.customerCode;

    if (!customerCode) {
      return res.status(400).json({
        message: "Customer code missing in token"
      });
    }

    // 🧠 NOTE:
    // Application.client field USER ke liye customerCode store karta hai
    const apps = await Application.find({
      client: customerCode
    })
      .select("applicationNumber trademark classes status")
      .sort({ applicationNumber: 1 });

    res.status(200).json(apps);
  } catch (err) {
    console.error("GET MY APPLICATIONS ERROR:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= ADMIN ================= */

/**
 * CREATE APPLICATION
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
        return res.status(400).json({
          message: `${field} is required`
        });
      }
    }

    // ✅ Admin ke liye client ObjectId hota hai
    if (!mongoose.Types.ObjectId.isValid(data.client)) {
      return res.status(400).json({
        message: "Invalid client ID"
      });
    }

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
    console.error("CREATE APPLICATION ERROR:", err.message);
    res.status(500).json({
      message: "Internal Server Error"
    });
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

    res.status(200).json({
      count: apps.length,
      data: apps
    });
  } catch (err) {
    console.error("GET APPLICATIONS ERROR:", err.message);
    res.status(500).json({ message: "Server error" });
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
    console.error("UPDATE APPLICATION ERROR:", err.message);
    res.status(500).json({ message: "Server error" });
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

    res.json({ message: "Application deleted" });
  } catch (err) {
    console.error("DELETE APPLICATION ERROR:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};
