const mongoose = require("mongoose");

const systemDocumentSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true
    },

    originalName: String,

    fileUrl: {
      type: String,
      required: true
    },

    publicId: {
      type: String,
      required: true
    },

    mimeType: String,
    size: Number,

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("SystemDocument", systemDocumentSchema);
