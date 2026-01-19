
const mongoose = require("mongoose");

const contactPersonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  designation: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true }
}, { _id: false });

const agentSchema = new mongoose.Schema({
  agentName: { type: String, required: true, trim: true },

  // ✅ CUSTOMER CODE (AUTO)
  customerCode: {
    type: String,
    required: true,
    default: "PEX-ADMIN"
  },

  city: { type: String, required: true },
  country: { type: String, required: true },

  phone: { type: String, trim: true },
  email: { type: String, trim: true },

  userId: { type: String, unique: true },
  password: { type: String },

  contactPersons: {
    type: [contactPersonSchema],
    default: []
  }

}, { timestamps: true });

module.exports = mongoose.model("Agent", agentSchema);