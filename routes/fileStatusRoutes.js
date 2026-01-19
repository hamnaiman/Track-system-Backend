const express = require("express");
const router = express.Router();

const {
  createFileStatus,
  getFileStatuses,
  updateFileStatus,
  deleteFileStatus
} = require("../controllers/fileStatusController");

const authMiddleware = require("../middleware/authMiddleware");
const { requirePermission } = require("../middleware/roleMiddleware");

// Admin + setup permission required
router.post("/", authMiddleware, requirePermission("setup"), createFileStatus);
router.get("/", authMiddleware, getFileStatuses);
router.put("/:id", authMiddleware, requirePermission("setup"), updateFileStatus);
router.delete("/:id", authMiddleware, requirePermission("setup"), deleteFileStatus);

module.exports = router;
