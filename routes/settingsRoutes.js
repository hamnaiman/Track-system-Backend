const express = require("express");
const router = express.Router();

const { getDateFormat, updateDateFormat } = require("../controllers/settingsController");

const auth = require("../middleware/authMiddleware");
const { requirePermission } = require("../middleware/roleMiddleware");

// ➤ Get current format
router.get("/date-format", auth, getDateFormat);

// ➤ Update format (only admin or user with permission)
router.put("/date-format", auth, requirePermission("setup"), updateDateFormat);

module.exports = router;
