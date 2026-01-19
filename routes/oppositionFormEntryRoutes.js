const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const { requirePermission } = require("../middleware/roleMiddleware");

const {
  addOppositionFormEntry,
  getOppositionFormEntries,
  deleteOppositionFormEntry
} = require("../controllers/oppositionFormEntryController");

// ADD (Update button)
router.post(
  "/",
  auth,
  requirePermission("add"),
  addOppositionFormEntry
);

// GRID VIEW
router.get(
  "/",
  auth,
  requirePermission("view"),
  getOppositionFormEntries
);

// DELETE
router.delete(
  "/:id",
  auth,
  requirePermission("delete"),
  deleteOppositionFormEntry
);

module.exports = router