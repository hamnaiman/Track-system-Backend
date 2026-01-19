const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const { requirePermission } = require("../middleware/roleMiddleware");
const uploadDocument = require("../middleware/uploadDocument");

const {
  uploadTMDocument,
  getTMDocuments,
  downloadTMDocument,
  deleteTMDocument
} = require("../controllers/tmDocumentController");

// ---------------- UPLOAD DOCUMENT ----------------
router.post(
  "/upload",
  auth,
  requirePermission("add"),
  uploadDocument.single("document"),
  uploadTMDocument
);

// ---------------- LIST DOCUMENTS (GRID) ----------------
router.get(
  "/",
  auth,
  requirePermission("view"),
  getTMDocuments
);

// ---------------- DOWNLOAD ----------------
router.get(
  "/download/:id",
  auth,
  requirePermission("view"),
  downloadTMDocument
);

// ---------------- DELETE ----------------
router.delete(
  "/:id",
  auth,
  requirePermission("delete"),
  deleteTMDocument
);

module.exports = router;
