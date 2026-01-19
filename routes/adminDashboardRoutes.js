const express = require("express");
const { getAdminDashboard } = require("../controllers/adminDashboardController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/dashboard", authMiddleware, getAdminDashboard);

module.exports = router;
