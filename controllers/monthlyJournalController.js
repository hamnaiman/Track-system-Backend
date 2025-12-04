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


// ➤ Delete entry
exports.deleteMonthlyJournal = async (req, res) => {
  try {
    const { id } = req.params;

    const entry = await MonthlyJournal.findByIdAndDelete(id);

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
