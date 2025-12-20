const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const auth = require("../middleware/authMiddleware");

const {
  uploadTMDocument,
  getTMDocuments,
  downloadTMDocument,
  deleteTMDocument
} = require("../controllers/tmDocumentController");

// ADD TO GRID (Update)
router.post(
  "/upload",
  auth,
  upload.single("document"),
  uploadTMDocument
);

// GRID LIST
router.get("/", auth, getTMDocuments);

// DOWNLOAD
router.get("/download/:id", auth, downloadTMDocument);

// DELETE
router.delete("/:id", auth, deleteTMDocument);

module.exports = router;
