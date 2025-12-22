const mongoose = require("mongoose");

const oppositionReminderSchema = new mongoose.Schema(
  {
    oppositionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Opposition",
      required: true,
      index: true
    },

    oppositionNumber: {
      type: String,
      required: true,
      index: true
    },

    reminderDate: {
      type: Date,
      required: true,
      index: true
    },

    taskDescription: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500
    },

    status: {
      type: String,
      enum: ["Pending", "Completed", "Cancelled"],
      default: "Pending",
      index: true
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "OppositionReminder",
  oppositionReminderSchema
);
