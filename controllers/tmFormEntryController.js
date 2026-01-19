const TMFormEntry = require("../models/tmFormEntryModel");
const Application = require("../models/applicationModel");

/* ================= CREATE ENTRY ================= */
exports.createEntry = async (req, res) => {
  try {
    const { applicationId, tmForm, filingDate, remark } = req.body;

    if (!applicationId || !tmForm || !filingDate) {
      return res.status(400).json({
        message: "Application, TM Form and Filing Date are required"
      });
    }

    // Verify application exists
    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    const entry = await TMFormEntry.create({
      applicationId,
      tmForm,
      filingDate,
      remark,
      createdBy: req.user._id
    });

    res.status(201).json({
      message: "TM Form entry added",
      data: entry
    });

  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};

/* ================= GET BY APPLICATION ================= */
exports.getEntriesByApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const entries = await TMFormEntry.find({ applicationId })
      .populate("tmForm", "formNumber")
      .populate("createdBy", "name")
      .sort({ filingDate: 1 });

    res.status(200).json(entries);
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};

/* ================= UPDATE ================= */
exports.updateEntry = async (req, res) => {
  try {
    const updated = await TMFormEntry.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Entry not found" });
    }

    res.json({
      message: "TM Form entry updated",
      data: updated
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= DELETE ================= */
exports.deleteEntry = async (req, res) => {
  try {
    const entry = await TMFormEntry.findById(req.params.id);
    if (!entry) {
      return res.status(404).json({ message: "Entry not found" });
    }

    await entry.deleteOne();

    res.json({ message: "TM Form entry deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
