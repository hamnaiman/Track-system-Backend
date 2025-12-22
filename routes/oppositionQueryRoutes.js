const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const { requirePermission } = require("../middleware/roleMiddleware");

const {
  getOppositionSingleQuery
} = require("../controllers/oppositionQueryController");

// 🔍 SINGLE QUERY
router.get(
  "/single-query",
  auth,
  requirePermission("view"),
  getOppositionSingleQuery
);

module.exports = router;
