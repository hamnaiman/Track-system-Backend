const express = require("express");
const router = express.Router();

const { addMonthlyJournal, getAllMonthlyJournals, deleteMonthlyJournal } =
  require("../controllers/monthlyJournalController");

const auth = require("../middleware/authMiddleware");
const { requirePermission } = require("../middleware/roleMiddleware");

// Add monthly journal entry
router.post("/", auth, requirePermission("setup"), addMonthlyJournal);

// Get all entries
router.get("/", auth, getAllMonthlyJournals);

// Delete entry
router.delete("/:id", auth, requirePermission("setup"), deleteMonthlyJournal);

module.exports = router;
