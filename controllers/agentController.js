const Agent = require("../models/agentModel");
const Application = require("../models/applicationModel");
const Customer = require("../models/customerModel");
const Hearing = require("../models/hearingModel");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");

/* =====================================================
   CREATE AGENT
===================================================== */
exports.createAgent = async (req, res) => {
  try {
    const {
      agentName,
      city,
      country,
      phone,
      email,
      contactPersons
    } = req.body;

    if (!agentName || !city || !country) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing"
      });
    }

    /* ===== AUTO GENERATE LOGIN CREDENTIALS ===== */
    const generatedUserId =
      "AGT-" + Math.floor(100000 + Math.random() * 900000);

    const generatedPassword =
      crypto.randomBytes(4).toString("hex");

    // 🔐 HASH PASSWORD (LIKE OLD SYSTEM)
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);

    const agent = await Agent.create({
      agentName,
      customerCode: "PEX-ADMIN",
      city,
      country,
      phone,
      email,
      contactPersons,

      // LOGIN FIELDS
      userId: generatedUserId,
      password: hashedPassword   // ✅ HASHED PASSWORD
    });

    res.status(201).json({
      success: true,
      message: "Agent registered successfully",
      data: agent,
      credentials: {
        userId: generatedUserId,
        password: generatedPassword // ⚠️ ONLY FOR DISPLAY / POPUP
      }
    });

  } catch (err) {
    console.error("CREATE AGENT ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message
    });
  }
};

/* =====================================================
   GET ALL AGENTS
===================================================== */
exports.getAgents = async (req, res) => {
  try {
    const agents = await Agent.find().sort({ agentName: 1 });

    res.status(200).json({
      success: true,
      data: agents
    });

  } catch (err) {
    console.error("GET AGENTS ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to load agents",
      error: err.message
    });
  }
};

/* =====================================================
   UPDATE AGENT
===================================================== */
exports.updateAgent = async (req, res) => {
  try {
    const updatedAgent = await Agent.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedAgent) {
      return res.status(404).json({
        success: false,
        message: "Agent not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Agent updated successfully",
      data: updatedAgent
    });

  } catch (err) {
    console.error("UPDATE AGENT ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update agent",
      error: err.message
    });
  }
};

/* =====================================================
   DELETE AGENT
===================================================== */
exports.deleteAgent = async (req, res) => {
  try {
    const deletedAgent = await Agent.findByIdAndDelete(req.params.id);

    if (!deletedAgent) {
      return res.status(404).json({
        success: false,
        message: "Agent not found"
      });
    }

    res.status(200).json({
      success: false,
      message: "Agent deleted successfully"
    });

  } catch (err) {
    console.error("DELETE AGENT ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to delete agent",
      error: err.message
    });
  }
};


const TMForm = require("../models/tmFormModel");

exports.getAgentDashboard = async (req, res) => {
  try {
    const totalApplications = await Application.countDocuments();
    const totalClients = await Customer.countDocuments();
    const totalTMForms = await TMForm.countDocuments(); // ✅ TM Forms
    const upcomingHearings = await Hearing.countDocuments({
      hearingDate: { $gte: new Date() }
    });

    res.status(200).json({
      success: true,
      data: {
        applications: totalApplications,
        clients: totalClients,
        tmForms: totalTMForms,
        hearings: upcomingHearings
      }
    });

  } catch (err) {
    console.error("AGENT DASHBOARD ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Agent dashboard load failed"
    });
  }
};