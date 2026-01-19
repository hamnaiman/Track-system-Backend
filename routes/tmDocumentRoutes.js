const express = require("express");
const router = express.Router();
const documentUpload = require("../middleware/documentUpload"); // ⚠️ path check
const auth = require("../middleware/authMiddleware");

const {
  uploadTMDocument,
  getTMDocuments,
  downloadTMDocument,
  deleteTMDocument
} = require("../controllers/tmDocumentController");

// ADD TO GRID
router.post(
  "/upload",
  auth,                               
  documentUpload.single("document"),  
  uploadTMDocument
);

// GRID LIST
router.get("/", auth, getTMDocuments);

// DOWNLOAD
router.get("/download/:id", auth, downloadTMDocument);

// DELETE
router.delete("/:id", auth, deleteTMDocument);

module.exports = router;
