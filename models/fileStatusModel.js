const mongoose = require("mongoose");

const fileStatusSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("FileStatus", fileStatusSchema);
