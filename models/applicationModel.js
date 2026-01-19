const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  applicationNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },

  fileNumber: {
    type: String,
    required: true,
    trim: true
  },

  dateOfFiling: { type: Date, required: true },
  takeOverDate: { type: Date },

  periodOfUse: { type: String, trim: true },

  wordOrLabel: {
    type: String,
    enum: ["Word", "Label"],
    required: true
  },

  classes: [
    {
      type: Number,
      min: 1,
      max: 45,
    }
  ],

  trademark: { type: String, required: true, trim: true },
  goods: { type: String, trim: true },

  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true
  },

  showCauseReceived: {
    type: String,
    enum: ["Yes", "No"],
    default: "No"
  },

  conflictingTrademark: { type: String, trim: true },
  tmNumber: { type: String, trim: true },

  status: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FileStatus",
  },

  // ===========================================
  // REMINDER FIELDS (Required for Reminder Report)
  // ===========================================
  reminderDate: {
    type: Date,
  },

  reminderRemark: {
    type: String,
    trim: true
  }

}, { timestamps: true });

module.exports = mongoose.model("Application", applicationSchema);
