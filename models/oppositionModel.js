const mongoose = require("mongoose");

const oppositionSchema = new mongoose.Schema(
  {
    oppositionNumber: {
      type: String,
      required: true,
      trim: true,
      index: true
    },

    applicationNumber: {
      type: String,
      index: true
    },

    oppositionType: {
      type: String, // Applicant / Opponent
      trim: true,
      index: true
    },

    status: {
      type: String, // Pending / Decided / Closed
      index: true
    },

    trademark: {
      type: String,
      trim: true,
      index: true
    },

    trademarkJournal: {
      type: String,
      trim: true
    },

    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      index: true
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
