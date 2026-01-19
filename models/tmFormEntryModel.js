const mongoose = require("mongoose");

const tmFormEntrySchema = new mongoose.Schema(
  {
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
      index: true
    },

    tmForm: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TMForm",
      required: true
    },

    filingDate: {
      type: Date,
      required: true
    },

    remark: {
      type: String,
      trim: true
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("TMFormEntry", tmFormEntrySchema);
