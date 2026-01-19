const mongoose = require("mongoose");

const citySchema = new mongoose.Schema(
  {
    countryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Country",
      required: true,
      index: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    }
  },
  { timestamps: true }
);

// Prevent duplicate city in SAME country
citySchema.index({ countryId: 1, name: 1 }, { unique: true });

module.exports = mongoose.model("City", citySchema);
