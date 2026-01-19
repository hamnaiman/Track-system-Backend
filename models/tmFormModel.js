const mongoose = require("mongoose");

const tmFormSchema = new mongoose.Schema(
  {
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
      type: String,
      required: true,
      enum: ["Low", "Medium", "High"], // ✅ STRING BASED
      default: "Low"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("TMForm", tmFormSchema);
