const express = require("express");
const router = express.Router();

const {
  addRenewalEntry,
  getRenewals,
  deleteRenewalEntry
} = require("../controllers/renewalController");

const authMiddleware = require("../middleware/authMiddleware");
const { requirePermission } = require("../middleware/roleMiddleware");

// Add renewal entry in grid
router.post("/", authMiddleware, requirePermission("setup"), addRenewalEntry);

// View all renewals for a specific application
router.get("/:applicationId", authMiddleware, getRenewals);

// Delete one renewal row
router.delete("/:renewalId/entry/:entryId", authMiddleware, requirePermission("setup"), deleteRenewalEntry);

module.exports = router;
