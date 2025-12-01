const mongoose = require("mongoose");

const hearingEntrySchema = new mongoose.Schema({
  hearingDate: { type: Date, required: true },
  before: { type: String, required: true, trim: true },
  commentsArguments: { type: String, trim: true },
  advocateAppeared: { type: String, trim: true }
}, { timestamps: true });

const hearingSchema = new mongoose.Schema({
  application: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Application",
    required: true
  },
  trademark: { type: String, trim: true },
  goods: { type: String, trim: true },

  hearings: [hearingEntrySchema]

}, { timestamps: true });

module.exports = mongoose.model("Hearing", hearingSchema);
