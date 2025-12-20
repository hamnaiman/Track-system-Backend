const OppositionDocument = require("../models/oppositionDocumentModel");

/**
 * UPLOAD DOCUMENT (UPDATE → GRID)
 */
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
        message:
          "Opposition number, document file and remarks are required"
      });
    }

    const doc = await OppositionDocument.create({
      oppositionNumber,
      applicationNumber,
      trademark,
      fileName: req.file.originalname,
      mimeType: req.file.mimetype,
      fileSize: req.file.size,
      fileBuffer: req.file.buffer,
      remarks,
      showToClient: showToClient === "true" || showToClient === true,
      uploadedBy: req.user?._id
    });

    res.status(201).json({
      message: "Document added to grid successfully",
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
 * GET DOCUMENTS (GRID VIEW)
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
      .select("-fileBuffer")
      .sort({ createdAt: -1 });

    res.json(docs);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * DOWNLOAD DOCUMENT
 */
exports.downloadOppositionDocument = async (req, res) => {
  try {
    const doc = await OppositionDocument.findById(req.params.id);
    if (!doc)
      return res.status(404).json({ message: "Document not found" });

    res.set({
      "Content-Type": doc.mimeType,
      "Content-Disposition": `attachment; filename="${doc.fileName}"`
    });

    res.send(doc.fileBuffer);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * DELETE DOCUMENT
 */
exports.deleteOppositionDocument = async (req, res) => {
  try {
    await OppositionDocument.findByIdAndDelete(req.params.id);
    res.json({ message: "Document deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
