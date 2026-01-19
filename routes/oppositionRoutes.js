const express = require("express");
const router = express.Router();

const {
  createOpposition,
  getOppositions,
  getOppositionByNumber,
  updateOpposition,
  deleteOpposition,

  addProceeding,
  deleteProceeding,

  addHearing,
  deleteHearing,

  addReminder,
  deleteReminder
} = require("../controllers/oppositionController");

const authMiddleware = require("../middleware/authMiddleware");

/* ================= BASIC OPPOSITION ================= */
router.post("/", authMiddleware, createOpposition);
router.get("/", authMiddleware, getOppositions);
router.get("/:oppositionNumber", authMiddleware, getOppositionByNumber);
router.put("/:oppositionNumber", authMiddleware, updateOpposition);

/* 🔴 DELETE ENTIRE OPPOSITION */
router.delete(
  "/:oppositionNumber",
  authMiddleware,
  deleteOpposition
);

/* ================= PROCEEDINGS ================= */
router.post(
  "/:oppositionNumber/proceedings",
  authMiddleware,
  addProceeding
);

router.delete(
  "/:oppositionNumber/proceedings/:proceedingId",
  authMiddleware,
  deleteProceeding
);

/* ================= HEARINGS ================= */
router.post(
  "/:oppositionNumber/hearings",
  authMiddleware,
  addHearing
);

router.delete(
  "/:oppositionNumber/hearings/:hearingId",
  authMiddleware,
  deleteHearing
);

/* ================= REMINDERS ================= */
router.post(
  "/:oppositionNumber/reminders",
  authMiddleware,
  addReminder
);

router.delete(
  "/:oppositionNumber/reminders/:reminderId",
  authMiddleware,
  deleteReminder
);

module.exports = router;
