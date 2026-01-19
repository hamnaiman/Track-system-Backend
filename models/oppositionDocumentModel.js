const mongoose = require("mongoose");

const oppositionDocumentSchema = new mongoose.Schema(
  {
    oppositionNumber: {
      type: String,
      required: true,
      index: true
    },

    applicationNumber: {
      type: String,
      required: true
    },

    trademark: {
      type: String
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
      max: 2 * 1024 * 1024
    },

    // ✅ CLOUDINARY
    fileUrl: {
      type: String,
      required: true
    },

    publicId: {
      type: String,
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

module.exports = mongoose.model(
  "OppositionDocument",
  oppositionDocumentSchema
);
