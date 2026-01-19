const mongoose = require("mongoose");

const classSchema = new mongoose.Schema(
  {
    classNumber: {
      type: Number,
      required: true,
      unique: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Class", classSchema);
