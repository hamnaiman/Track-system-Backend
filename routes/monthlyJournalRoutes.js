const express = require("express");
const router = express.Router();

const {
  addMonthlyJournal,
  getAllMonthlyJournals,
  deleteMonthlyJournal,
  searchMonthlyJournal   // ⭐ MUST IMPORT THIS
} = require("../controllers/monthlyJournalController");

const auth = require("../middleware/authMiddleware");
const { requirePermission } = require("../middleware/roleMiddleware");

// Add monthly journal entry
router.post("/", auth, requirePermission("setup"), addMonthlyJournal);

// Get all entries
router.get("/", auth, getAllMonthlyJournals);

// Search (manual trademark search)
router.post("/search", auth, searchMonthlyJournal);

// Delete entry
router.delete("/:id", auth, requirePermission("setup"), deleteMonthlyJournal);

module.exports = router;
