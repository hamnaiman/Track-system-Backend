const mongoose = require("mongoose");

const tmDocumentSchema = new mongoose.Schema(
  {
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
      index: true
    },

    applicationNumber: {
      type: String,
      required: true
    },

    fileName: {
      type: String,
      required: true
    },

    mimeType: {
      type: String,
      required: true
    },

    fileSize: {
      type: Number,
      required: true,
      max: 2 * 1024 * 1024 // 2MB
    },

    fileBuffer: {
      type: Buffer,
      required: true
    },

    remarks: {
      type: String,
      required: true,
      trim: true
    },

    showToClient: {
      type: Boolean,
      default: false
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("TMDocument", tmDocumentSchema);
