const mongoose = require("mongoose");

const oppositionSchema = new mongoose.Schema(
  {
    oppositionNumber: {
      type: String,
      required: true,
      index: true,
      trim: true
    },

    applicationNumber: {
      type: String,
      index: true
    },

    oppositionType: {
      type: String, // Applicant / Opponent / etc
      trim: true
    },

    status: {
      type: String, // Pending / Decided / Closed
      index: true
    },

    trademark: {
      type: String,
      index: true,
      trim: true
    },

    trademarkJournalNumber: {
      type: String,
      trim: true
    },

    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer"
    },

    filingDate: {
      type: Date,
      index: true
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Opposition", oppositionSchema);
