const express = require("express");
const router = express.Router();

const { createRole, getAllRoles } = require("../controllers/roleController");
const auth = require("../middleware/authMiddleware");
const { requirePermission } = require("../middleware/roleMiddleware");

// ✅ Only admin with SETUP permission can create roles
router.post("/", auth, requirePermission("setup"), createRole);

// ✅ Anyone logged-in admin can fetch roles for dropdown
router.get("/", auth, getAllRoles);

module.exports = router;
