const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { requirePermission } = require("../middleware/roleMiddleware");
const { createUser } = require("../controllers/userController");

// create user (admin only): requirePermission('setup') OR requireRole('CustomerAdmin') in your real app
router.post("/", authMiddleware, requirePermission("setup"), createUser);

module.exports = router;
