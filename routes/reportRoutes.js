const express = require("express");
const router = express.Router();

const { basicSearchReport } = require("../controllers/reportController");
const { tmSingleQueryReport } = require("../controllers/tmSingleQueryController");
const authMiddleware = require("../middleware/authMiddleware");

// Existing
router.post("/basic-search", authMiddleware, basicSearchReport);

// ✅ TM SINGLE QUERY
router.post(
  "/tm-single-query",
  authMiddleware,
  tmSingleQueryReport
);

module.exports = router;
