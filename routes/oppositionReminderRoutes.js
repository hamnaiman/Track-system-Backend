const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const { requirePermission } = require("../middleware/roleMiddleware");

const {
  createReminder,
  getReminderReport
} = require("../controllers/oppositionReminderController");

// CREATE REMINDER
router.post(
  "/",
  auth,
  requirePermission("add"),
  createReminder
);

// REMINDER REPORT
router.get(
  "/report",
  auth,
  requirePermission("view"),
  getReminderReport
);

module.exports = router;
