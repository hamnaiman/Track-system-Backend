const OppositionFormEntry = require("../models/oppositionFormEntryModel");
const Application = require("../models/applicationModel");

/* ======================================================
   ADD OPPOSITION FORM ENTRY
====================================================== */
exports.addOppositionFormEntry = async (req, res) => {
  try {
    const {
      applicationNumber,
      oppositionNumber,
      formNumber,
      filingDate,
      remarks
    } = req.body;

    if (!applicationNumber || !oppositionNumber || !formNumber || !filingDate) {
      return res.status(400).json({
        message: "All required fields must be provided"
      });
    }

    /* --------------------------------------------------
       1️⃣ APPLICATION VALIDATION (READ ONLY)
    -------------------------------------------------- */
    const app = await Application.findOne({ applicationNumber }).lean();
    if (!app) {
      return res.status(404).json({ message: "Application not found" });
    }

    /* --------------------------------------------------
       2️⃣ CREATE FORM ENTRY (NO SIDE EFFECTS)
    -------------------------------------------------- */
    const entry = await OppositionFormEntry.create({
      applicationNumber,
      oppositionNumber,
      formNumber,
      filingDate,
      remarks,
      createdBy: req.user?._id
    });

    res.status(201).json({
      message: "Opposition form entry added successfully",
      data: entry
    });

  } catch (err) {
    console.error("Opposition Form Entry Error:", err);
    res.status(500).json({
      message: "Failed to add opposition form entry",
      error: err.message
    });
  }
};

/* ======================================================
   GET FORM ENTRIES (GRID VIEW)
====================================================== */
exports.getOppositionFormEntries = async (req, res) => {
  try {
    const { applicationNumber } = req.query;

    if (!applicationNumber) {
      return res.status(400).json({
        message: "Application number is required"
      });
    }

    const entries = await OppositionFormEntry
      .find({ applicationNumber })
      .sort({ createdAt: -1 });

    res.json(entries);

  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch opposition form entries",
      error: err.message
    });
  }
};

/* ======================================================
   DELETE FORM ENTRY
====================================================== */
exports.deleteOppositionFormEntry = async (req, res) => {
  try {
    const entry = await OppositionFormEntry.findByIdAndDelete(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: "Entry not found" });
    }

    res.json({ message: "Opposition form entry deleted successfully" });

  } catch (err) {
    res.status(500).json({
      message: "Failed to delete opposition form entry",
      error: err.message
    });
  }
};
