const express = require("express");
const router = express.Router();

const {
  createClass,
  getClasses,
  updateClass,
  deleteClass
} = require("../controllers/classController");

const authMiddleware = require("../middleware/authMiddleware");
const { requirePermission } = require("../middleware/roleMiddleware");

// Only admin (setup)
router.post("/", authMiddleware, requirePermission("setup"), createClass);
router.get("/", authMiddleware, getClasses);
router.put("/:id", authMiddleware, requirePermission("setup"), updateClass);
router.delete("/:id", authMiddleware, requirePermission("setup"), deleteClass);

module.exports = router;
