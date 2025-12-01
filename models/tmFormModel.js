const mongoose = require("mongoose");

const tmFormSchema = new mongoose.Schema({
  formNumber: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  priority: {
    type: Number,
    required: true,
    min: 1
  }
}, { timestamps: true });

module.exports = mongoose.model("TMForm", tmFormSchema);
