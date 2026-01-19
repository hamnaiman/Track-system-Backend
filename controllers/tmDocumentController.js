const TMDocument = require("../models/tmDocumentModel");
const Application = require("../models/applicationModel");
const uploadToCloudinary = require("../utils/cloudinaryUpload");
const cloudinary = require("../utils/cloudinary");

/**
 * ============================
 * UPLOAD DOCUMENT (GRID ENTRY)
 * ============================
 */


exports.uploadTMDocument = async (req, res) => {
  try {

    console.log("FILE:", req.file);
    const { applicationNumber, remarks, showToClient } = req.body;

    if (!applicationNumber || !remarks || !req.file) {
      return res.status(400).json({
        message: "Application number, document and remarks are required",
      });
    }

    const application = await Application.findOne({ applicationNumber });
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    // 🔥 Upload file to Cloudinary
    const result = await uploadToCloudinary(
  req.file.buffer,
  "tm-documents",
  req.file.mimetype
);


    const doc = await TMDocument.create({
      applicationId: application._id,
      applicationNumber,
      fileName: req.file.originalname,
      mimeType: req.file.mimetype,
      fileSize: req.file.size,
      fileUrl: result.secure_url,
      publicId: result.public_id,
      remarks,
      showToClient: showToClient === "true" || showToClient === true,
      uploadedBy: req.user?._id,
    });

    res.status(201).json({
      message: "Document added to grid successfully",
      data: doc,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to upload document",
      error: err.message,
    });
  }
};

/**
 * ============================
 * GET DOCUMENTS (GRID VIEW)
 * ============================
 */
exports.getTMDocuments = async (req, res) => {
  try {
    const { applicationNumber } = req.query;

    if (!applicationNumber) {
      return res.status(400).json({ message: "Application number required" });
    }

    const docs = await TMDocument.find({ applicationNumber })
      .sort({ createdAt: -1 });

    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * ============================
 * DOWNLOAD DOCUMENT
 * ============================
 */
exports.downloadTMDocument = async (req, res) => {
  try {
    const doc = await TMDocument.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    // 🔗 Cloudinary direct file access
    return res.redirect(doc.fileUrl);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * ============================
 * DELETE DOCUMENT (GRID DELETE)
 * ============================
 */
exports.deleteTMDocument = async (req, res) => {
  try {
    const doc = await TMDocument.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    // 🔥 Delete from Cloudinary
    await cloudinary.uploader.destroy(doc.publicId, {
      resource_type: "raw",
    });

    // 🔥 Delete from Database
    await TMDocument.findByIdAndDelete(req.params.id);

    res.json({ message: "Document deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
