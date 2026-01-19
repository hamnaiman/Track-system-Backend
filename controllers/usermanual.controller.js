const SystemDocument = require("../models/SystemDocument.model");
const uploadToCloudinary = require("../utils/cloudinaryUpload");
const cloudinary = require("../utils/cloudinary");

/**
 * ================= ADMIN: Upload / Replace User Manual =================
 */
exports.uploadUserManual = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "PDF file is required" });
    }

    if (req.file.mimetype !== "application/pdf") {
      return res.status(400).json({ message: "Only PDF files are allowed" });
    }

    // 🔍 Check existing
    const existing = await SystemDocument.findOne({ key: "USER_MANUAL" });

    // 🧹 Remove old file from Cloudinary
    if (existing?.publicId) {
      await cloudinary.uploader.destroy(existing.publicId, {
        resource_type: "raw"
      });
    }

    // 🔥 Upload new PDF
    const result = await uploadToCloudinary(
      req.file.buffer,
      "user-manuals",
      "raw"
    );

    // ✅ UPSERT (NO DUPLICATE ISSUE EVER)
    await SystemDocument.findOneAndUpdate(
      { key: "USER_MANUAL" },
      {
        key: "USER_MANUAL",
        originalName: req.file.originalname,
        fileUrl: result.secure_url,
        publicId: result.public_id,
        mimeType: req.file.mimetype,
        size: req.file.size,
        uploadedBy: req.user._id
      },
      {
        new: true,
        upsert: true
      }
    );

    res.json({ message: "User manual uploaded successfully" });

  } catch (error) {
    console.error("User Manual Upload Error:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * ================= USER: Download User Manual =================
 */
exports.downloadUserManual = async (req, res) => {
  try {
    const doc = await SystemDocument.findOne({ key: "USER_MANUAL" });

    if (!doc) {
      return res.status(404).json({ message: "User manual not found" });
    }

    return res.redirect(doc.fileUrl);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
