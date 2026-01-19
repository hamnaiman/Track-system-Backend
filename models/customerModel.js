const mongoose = require("mongoose");

// Contact Person Sub-Schema
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  designation: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true },
  mobile: { type: String, required: true, trim: true }
}, { _id: false });

// Main Customer Schema
const customerSchema = new mongoose.Schema({
  partyType: { type: String, enum: ["Local", "Foreign"], required: true },

  customerName: { type: String, required: true, trim: true, unique: true },

  address: { type: String, required: true, trim: true },

  city: { type: mongoose.Schema.Types.ObjectId, ref: "City", required: true },
  country: { type: mongoose.Schema.Types.ObjectId, ref: "Country", required: true },

  phone: { type: String, trim: true },
  fax: { type: String, trim: true },

  email: { type: String, trim: true },
  web: { type: String, trim: true },

  businessType: { type: mongoose.Schema.Types.ObjectId, ref: "BusinessType", required: true },

  agent: { type: mongoose.Schema.Types.ObjectId, ref: "Agent" },

  userName: { type: String, required: true, trim: true },
  password: { type: String, required: true, trim: true },

  contactPersons: [contactSchema],

}, { timestamps: true });

module.exports = mongoose.model("Customer", customerSchema);
