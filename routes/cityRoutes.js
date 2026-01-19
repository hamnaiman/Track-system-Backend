const express = require("express");
const router = express.Router();
const {
  createCity,
  getCities,
  updateCity,
  deleteCity
} = require("../controllers/cityController");

const authMiddleware = require("../middleware/authMiddleware");
const { requirePermission } = require("../middleware/roleMiddleware");

// Add city (admin only)
router.post("/", authMiddleware, requirePermission("setup"), createCity);

// List cities for a specific country
router.get("/", authMiddleware, getCities);

// Edit city (admin only)
router.put("/:id", authMiddleware, requirePermission("setup"), updateCity);

// Delete city (admin only)
router.delete("/:id", authMiddleware, requirePermission("setup"), deleteCity);

module.exports = router;
