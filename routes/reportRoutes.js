const express = require("express");
const router = express.Router();
const { basicSearchReport } = require("../controllers/reportController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/basic-search", authMiddleware, basicSearchReport);

module.exports = router;
