const express = require("express");
const router = express.Router();

const uploadLogo = require("../middleware/uploadLogo");
const {
  uploadLogo: uploadLogoController,
  getLogo
} = require("../controllers/logoController");

const auth = require("../middleware/authMiddleware");

// 🔐 Admin uploads logo
router.post("/upload", auth, uploadLogo, uploadLogoController);

// 🌍 Anyone can view logo (required for <img>, PDF, print)
router.get("/", getLogo);

module.exports = router;
