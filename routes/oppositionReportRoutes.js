const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const { requirePermission } = require("../middleware/roleMiddleware");

const {
  generateOppositionReport
} = require("../controllers/oppositionReportController");

// REPORT
router.get(
  "/",
  auth,
  requirePermission("view"),
  generateOppositionReport
);

module.exports = router;
