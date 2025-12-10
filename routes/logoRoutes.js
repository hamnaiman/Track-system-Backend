const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadLogo");
const { uploadLogo, getLogo } = require("../controllers/logoController");

const auth = require("../middleware/authMiddleware");
const { requirePermission } = require("../middleware/roleMiddleware");

// Upload logo
router.post(
  "/upload",
  auth,
  requirePermission("setup"),
  upload,
  uploadLogo
);

// Get current logo
router.get("/", auth, getLogo);

module.exports = router;