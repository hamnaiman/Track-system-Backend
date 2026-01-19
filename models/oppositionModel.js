const mongoose = require("mongoose");

const proceedingSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  remark: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

const hearingSchema = new mongoose.Schema({
  hearingDate: Date,
  before: String,
  comments: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });

const reminderSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  text: { type: String, required: true }
}, { timestamps: true });

const oppositionSchema = new mongoose.Schema({

  /* ================= BASIC ================= */
  oppositionNumber: { type: String, required: true, unique: true },
  fileNumber: String,

  applicationNumber: { type: String, required: true },

  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true
  },

  /* ================= OUR TRADEMARK ================= */
  trademark: String,
  trademarkStatus: String,
  class: String,
  goods: String,
  periodOfUse: String,

  trademarkJournalNumber: String,
  journalDate: Date,
  publicationDate: Date,

  /* ================= OPPOSITION ================= */
  oppositionDate: { type: Date, required: true },
  oppositionType: {
    type: String,
    enum: ["Opponent", "Applicant"],
    default: "Opponent"
  },
  status: {
    type: String,
    enum: ["Pending", "Decided", "Withdrawn"],
    default: "Pending"
  },
  remarks: String,

  /* ================= OTHER SIDE ================= */
  otherSide: {
    applicationNumber: String,
    trademark: String,
    class: String,
    goods: String,
    applicationFiledOn: Date,
    periodOfUse: String,

    journalNumber: String,
    journalPage: String,
    journalDate: Date,
    publicationDate: Date,

    clientName: String,
    clientAddress: String,

    advocateName: String,
    advocateAddress: String
  },

  /* ================= PROCEEDINGS ================= */
  proceedings: [proceedingSchema],

  /* ================= HEARINGS ================= */
  hearings: [hearingSchema],

  /* ================= REMINDERS ================= */
  reminders: [reminderSchema],

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }

}, { timestamps: true });

module.exports = mongoose.model("Opposition", oppositionSchema);
