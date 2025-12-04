const express = require("express");
const router = express.Router();

const { getRenewalReport } = require("../controllers/reportRenewalController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, getRenewalReport);

module.exports = router;
