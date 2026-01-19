const mongoose = require("mongoose");

const logoSchema = new mongoose.Schema(
  {
    fileUrl: {
      type: String,
      required: true
    },
    publicId: {
      type: String,
      required: true
    },
    mimeType: {
      type: String,
      required: true
    },
    size: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Logo", logoSchema);
