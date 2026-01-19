const express = require("express");
const router = express.Router();
const { createCountry, getCountries, updateCountry, deleteCountry } = require("../controllers/countryController");
const authMiddleware = require("../middleware/authMiddleware");
const { requirePermission } = require("../middleware/roleMiddleware");

// Admin only -> setup permission required
router.post("/", authMiddleware, requirePermission("setup"), createCountry);
router.get("/", authMiddleware, getCountries);
router.put("/:id", authMiddleware, requirePermission("setup"), updateCountry);
router.delete("/:id", authMiddleware, requirePermission("setup"), deleteCountry);

module.exports = router;
