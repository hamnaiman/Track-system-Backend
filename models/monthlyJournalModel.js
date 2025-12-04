const mongoose = require("mongoose");

const monthlyJournalSchema = new mongoose.Schema({
  journalDate: {
    type: Date,
    required: true
  },
  journalNumber: {
    type: String,
    required: true,
    trim: true
  },
  applicationNumber: {
    type: String,
    required: true,
    trim: true
  },
  trademark: {
    type: String,
    required: true,
    trim: true
  },
  class: {
    type: Number,
    required: true,
    min: 1,
    max: 45
  }
}, { timestamps: true });

module.exports = mongoose.model("MonthlyJournal", monthlyJournalSchema);
