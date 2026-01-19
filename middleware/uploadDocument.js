const multer = require("multer");

const storage = multer.memoryStorage();

const documentUpload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024 // ✅ 2MB (TM requirement)
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      return cb(
        new Error("Invalid file type. Only PDF, JPG, PNG, DOC, DOCX allowed"),
        false
      );
    }

    cb(null, true);
  }
});

module.exports = documentUpload;
