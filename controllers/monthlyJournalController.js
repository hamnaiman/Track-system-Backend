// controllers/monthlyJournalController.js

const MonthlyJournal = require("../models/monthlyJournalModel");

// ➤ Add Monthly Journal Entry
exports.addMonthlyJournal = async (req, res) => {
  try {
    const { journalDate, journalNumber, applicationNumber, trademark, class: classNo } = req.body;

    if (!journalDate || !journalNumber || !applicationNumber || !trademark || !classNo) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const entry = await MonthlyJournal.create({
      journalDate,
      journalNumber,
      applicationNumber,
      trademark,
      class: classNo
    });

    res.status(201).json({
      success: true,
      message: "Monthly journal entry added successfully",
      data: entry
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// ➤ Get All Monthly Journal Entries
exports.getAllMonthlyJournals = async (req, res) => {
  try {
    const entries = await MonthlyJournal.find().sort({ journalDate: -1 });

    res.status(200).json({
      success: true,
      count: entries.length,
      data: entries
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// ➤ Delete Monthly Journal Entry
exports.deleteMonthlyJournal = async (req, res) => {
  try {
    const entry = await MonthlyJournal.findByIdAndDelete(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: "Entry not found" });
    }

    res.json({
      success: true,
      message: "Entry deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// ---------------------------
// 🔍 Search Manual Trademark in Monthly Journal
// ---------------------------
exports.searchMonthlyJournal = async (req, res) => {
  try {
    const { journalNumber, text, applicationNumber } = req.body;

    let query = {};

    if (journalNumber) query.journalNumber = journalNumber.trim();
    if (applicationNumber) query.applicationNumber = applicationNumber.trim();
    if (text) query.trademark = { $regex: text.trim(), $options: "i" };

    const results = await MonthlyJournal.find(query).sort({ journalDate: -1 });

    res.status(200).json({
      success: true,
      count: results.length,
      data: results
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
