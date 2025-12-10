// middleware/uploadLogo.js
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

// Create uploads folder if missing
const uploadPath = path.join(__dirname, "../uploads/logo");
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

// Multer memory storage (buffer-based)
const storage = multer.memoryStorage();

// File filter (images only)
const fileFilter = (req, file, cb) => {
  const allowed = ["image/png", "image/jpeg"];
  if (!allowed.includes(file.mimetype)) {
    return cb(new Error("Only PNG and JPG images are allowed"));
  }
  cb(null, true);
};

// Upload middleware
const upload = multer({
  storage,
  limits: { fileSize: 1 * 1024 * 1024 }, // 1MB
  fileFilter
}).single("logo"); // field name must be 'logo'

module.exports = upload;