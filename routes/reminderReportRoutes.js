const express = require("express");
const router = express.Router();

const { getReminderReport } = require("../controllers/reminderReportController");
const authMiddleware = require("../middleware/authMiddleware");

// ✅ All logged-in users can generate reminder report
router.post(
  "/",
  authMiddleware,
  getReminderReport
);

module.exports = router;
