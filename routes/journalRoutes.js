const express = require("express");
const router = express.Router();

const {
  addJournalEntry,
  getJournalByApplication,
  deleteJournalEntry
} = require("../controllers/journalController");

const authMiddleware = require("../middleware/authMiddleware");
const { requirePermission } = require("../middleware/roleMiddleware");

// Add entry
router.post("/", authMiddleware, requirePermission("setup"), addJournalEntry);

// Get all entries for application
router.get("/:appId", authMiddleware, getJournalByApplication);

// Delete entry
router.delete("/:appId/:entryId", authMiddleware, requirePermission("setup"), deleteJournalEntry);

module.exports = router;