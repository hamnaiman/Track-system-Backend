const express = require("express");
const router = express.Router();

const {
  createEntry,
  getEntriesByApplication,
  updateEntry,
  deleteEntry
} = require("../controllers/tmFormEntryController");

const authMiddleware = require("../middleware/authMiddleware");
const { requirePermission } = require("../middleware/roleMiddleware");

/* =====================================================
   VIEW TM FORM ENTRIES
===================================================== */
router.get(
  "/:applicationId",
  authMiddleware,
  requirePermission("view"),
  getEntriesByApplication
);

/* =====================================================
   CREATE TM FORM ENTRY
===================================================== */
router.post(
  "/",
  authMiddleware,
  requirePermission("add"),
  createEntry
);

/* =====================================================
   UPDATE TM FORM ENTRY
===================================================== */
router.put(
  "/:id",
  authMiddleware,
  requirePermission("edit"),
  updateEntry
);

/* =====================================================
   DELETE TM FORM ENTRY
===================================================== */
router.delete(
  "/:id",
  authMiddleware,
  requirePermission("delete"),
  deleteEntry
);

module.exports = router;
