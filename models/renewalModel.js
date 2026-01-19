const mongoose = require("mongoose");

// Single Renewal Entry (Sub-document)
const renewalEntrySchema = new mongoose.Schema({
  renewedUpto: {
    type: Date,
    required: true
  },
  remark: {
    type: String,
    trim: true
  }
}, { timestamps: true });

// Main Renewal Record (Linked with Application)
const renewalSchema = new mongoose.Schema({
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Application",
    required: true
  },

  entries: [renewalEntrySchema]

}, { timestamps: true });

module.exports = mongoose.model("Renewal", renewalSchema);
