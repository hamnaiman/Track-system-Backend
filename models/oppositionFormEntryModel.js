const mongoose = require("mongoose");

const oppositionFormEntrySchema = new mongoose.Schema(
  {
    applicationNumber: {
      type: String,
      required: true,
      index: true,
      trim: true
    },

    oppositionNumber: {
      type: String,
      required: true,
      trim: true
    },

    formNumber: {
      type: String,
      required: true,
      trim: true
    },

    filingDate: {
      type: Date,
      required: true
    },

    remarks: {
      type: String,
      trim: true
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "OppositionFormEntry",
  oppositionFormEntrySchema
);
