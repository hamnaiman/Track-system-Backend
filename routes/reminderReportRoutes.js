const express = require("express");
const router = express.Router();

const { getReminderReport } = require("../controllers/reminderReportController");

const authMiddleware = require("../middleware/authMiddleware");
const { requirePermission } = require("../middleware/roleMiddleware");

// Only logged-in users can generate report
router.post(
  "/",
  authMiddleware,
  requirePermission("reports"),
  getReminderReport
);

module.exports = router;
