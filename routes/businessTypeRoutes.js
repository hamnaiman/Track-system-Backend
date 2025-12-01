const express = require("express");
const router = express.Router();

const {
  createBusinessType,
  getBusinessTypes,
  updateBusinessType,
  deleteBusinessType
} = require("../controllers/businessTypeController.js");

const authMiddleware = require("../middleware/authMiddleware");
const { requirePermission } = require("../middleware/roleMiddleware");

// Only admin (setup permission) can create/update/delete
router.post("/", authMiddleware, requirePermission("setup"), createBusinessType);
router.get("/", authMiddleware, getBusinessTypes);
router.put("/:id", authMiddleware, requirePermission("setup"), updateBusinessType);
router.delete("/:id", authMiddleware, requirePermission("setup"), deleteBusinessType);

module.exports = router;
