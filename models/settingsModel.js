const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({
  dateFormat: {
    type: String,
    enum: ["MM/dd/yyyy", "dd/MM/yyyy"],
    default: "MM/dd/yyyy"
  }
}, { timestamps: true });

module.exports = mongoose.model("Settings", settingsSchema);
