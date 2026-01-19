const OppositionDocument = require("../models/oppositionDocumentModel");
const uploadToCloudinary = require("../utils/cloudinaryUpload");
const cloudinary = require("../utils/cloudinary");


exports.uploadOppositionDocument = async (req, res) => {
  try {
    const {
      oppositionNumber,
      applicationNumber,
      trademark,
      remarks,
      showToClient
    } = req.body;

    if (!oppositionNumber || !remarks || !req.file) {
      return res.status(400).json({
        message: "Opposition number, document file and remarks are required"
      });
    }

    // 🔥 Upload to Cloudinary
    const result = await uploadToCloudinary(
      req.file.buffer,
      "opposition-documents"
    );

    const doc = await OppositionDocument.create({
      oppositionNumber,
      applicationNumber,
      trademark,
      fileName: req.file.originalname,
      mimeType: req.file.mimetype,
      fileSize: req.file.size,
      fileUrl: result.secure_url,
      publicId: result.public_id,
      remarks,
      showToClient: showToClient === "true" || showToClient === true,
      uploadedBy: req.user?._id
    });

    res.status(201).json({
      message: "Opposition document uploaded successfully",
      data: doc
    });

  } catch (err) {
    console.error("Upload Opposition Document Error:", err);
    res.status(500).json({
      message: "Failed to upload opposition document",
      error: err.message
    });
  }
};

/**
 * ============================
 * GET OPPOSITION DOCUMENTS
 * ============================
 */
exports.getOppositionDocuments = async (req, res) => {
  try {
    const { oppositionNumber } = req.query;

    if (!oppositionNumber) {
      return res.status(400).json({
        message: "Opposition number is required"
      });
    }

    const docs = await OppositionDocument.find({ oppositionNumber })
      .sort({ createdAt: -1 });

    res.json(docs);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * ============================
 * DOWNLOAD OPPOSITION DOCUMENT
 * ============================
 */
exports.downloadOppositionDocument = async (req, res) => {
  try {
    const doc = await OppositionDocument.findById(req.params.id);

    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    // 🔗 Direct Cloudinary access
    return res.redirect(doc.fileUrl);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * ============================
 * DELETE OPPOSITION DOCUMENT
 * ============================
 */
exports.deleteOppositionDocument = async (req, res) => {
  try {
    const doc = await OppositionDocument.findById(req.params.id);

    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    // 🔥 Delete from Cloudinary
    await cloudinary.uploader.destroy(doc.publicId, {
      resource_type: "raw"
    });

    // 🔥 Delete from DB
    await OppositionDocument.findByIdAndDelete(req.params.id);

    res.json({ message: "Document deleted successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
