const express = require("express");
const router = express.Router();
const {
  addHearing,
  getHearingByApplication,
  updateHearingEntry,
  deleteHearingEntry
} = require("../controllers/hearingController");

const authMiddleware = require("../middleware/authMiddleware");
const { requirePermission } = require("../middleware/roleMiddleware");

// Create or add hearing entry
router.post("/", authMiddleware, requirePermission("setup"), addHearing);

// Get hearing list for one application
router.get("/:appId", authMiddleware, getHearingByApplication);

// Update one hearing row
router.put("/entry/:hearingId", authMiddleware, requirePermission("setup"), updateHearingEntry);

// Delete one row
router.delete("/entry/:hearingId", authMiddleware, requirePermission("setup"), deleteHearingEntry);

module.exports = router;
