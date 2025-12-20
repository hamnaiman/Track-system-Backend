const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const { requirePermission } = require("../middleware/roleMiddleware");
const uploadDocument = require("../middleware/uploadDocument");

const {
  uploadOppositionDocument,
  getOppositionDocuments,
  downloadOppositionDocument,
  deleteOppositionDocument
} = require("../controllers/oppositionDocumentController");

// ---------------- UPLOAD (UPDATE → GRID) ----------------
router.post(
  "/upload",
  auth,
  requirePermission("add"),
  uploadDocument.single("document"),
  uploadOppositionDocument
);

// ---------------- LIST (GRID) ----------------
router.get(
  "/",
  auth,
  requirePermission("view"),
  getOppositionDocuments
);

// ---------------- DOWNLOAD ----------------
router.get(
  "/download/:id",
  auth,
  requirePermission("view"),
  downloadOppositionDocument
);

// ---------------- DELETE ----------------
router.delete(
  "/:id",
  auth,
  requirePermission("delete"),
  deleteOppositionDocument
);

module.exports = router;
