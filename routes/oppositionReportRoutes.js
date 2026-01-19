const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { requirePermission } = require("../middleware/roleMiddleware");
const { generateOppositionReport } = require("../controllers/oppositionReportController");

/**
 * ADMIN – permission required
 */
router.get(
  "/admin",
  auth,
  requirePermission("view"),
  generateOppositionReport
);

/**
 * USER – any logged-in user
 */
router.get(
  "/user",
  auth,
  generateOppositionReport
);

module.exports = router;
