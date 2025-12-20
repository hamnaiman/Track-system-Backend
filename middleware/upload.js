const multer = require("multer");

// memory storage (buffer-based)
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB default
  }
});

module.exports = upload;
