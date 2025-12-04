const mongoose = require("mongoose");

const journalEntrySchema = new mongoose.Schema({
  jNo: { type: String, required: true, trim: true },
  pageNo: { type: String, required: true, trim: true },
  journalDate: { type: Date, required: true },
  publishedDate: { type: Date, required: true },
  remark: { type: String, trim: true },
}, { timestamps: true });

const journalSchema = new mongoose.Schema({
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Application",
    required: true
  },

  entries: [journalEntrySchema]

}, { timestamps: true });

module.exports = mongoose.model("Journal", journalSchema);