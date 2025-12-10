const mongoose = require("mongoose");

const logoSchema = new mongoose.Schema(
  {
    logo: {
      data: Buffer,
      contentType: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Logo", logoSchema);
