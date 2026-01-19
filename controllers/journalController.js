const Journal = require("../models/journalModel");
const Application = require("../models/applicationModel");

// Add Journal Entry
exports.addJournalEntry = async (req, res) => {
  try {
    const { applicationId, jNo, pageNo, journalDate, publishedDate, remark } = req.body;

    if (!applicationId || !jNo || !pageNo || !journalDate || !publishedDate) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    const applicationExists = await Application.findById(applicationId);
    if (!applicationExists) {
      return res.status(404).json({ message: "Application not found" });
    }

    let journal = await Journal.findOne({ application: applicationId });

    if (!journal) {
      journal = await Journal.create({
        application: applicationId,
        entries: []
      });
    }

    journal.entries.push({
      jNo,
      pageNo,
      journalDate,
      publishedDate,
      remark
    });

    await journal.save();

    res.status(201).json({
      message: "Journal entry added successfully",
      data: journal
    });

  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};


// Get all entries for an application
exports.getJournalByApplication = async (req, res) => {
  try {
    const journal = await Journal.findOne({ application: req.params.appId })
      .populate("application", "applicationNumber trademark goods");

    if (!journal) {
      return res.status(404).json({ message: "No journal entries found" });
    }

    res.status(200).json({
      success: true,
      count: journal.entries.length,
      data: journal
    });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


// Delete single Journal Entry
exports.deleteJournalEntry = async (req, res) => {
  try {
    const journal = await Journal.findOne({ application: req.params.appId });

    if (!journal) {
      return res.status(404).json({ message: "Journal record not found" });
    }

    journal.entries = journal.entries.filter(
      entry => entry._id.toString() !== req.params.entryId
    );

    await journal.save();

    res.json({ message: "Journal entry deleted" });

  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};