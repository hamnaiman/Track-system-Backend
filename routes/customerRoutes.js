// routes/customerRoutes.js

const express = require("express");
const router = express.Router();

const {
  createCustomer,
  getCustomers,
  updateCustomer,
  deleteCustomer
} = require("../controllers/customerController");

const authMiddleware = require("../middleware/authMiddleware");
const { requirePermission } = require("../middleware/roleMiddleware");

// Routes
router.post("/", authMiddleware, requirePermission("setup"), createCustomer);
router.get("/", authMiddleware, getCustomers);
router.put("/:id", authMiddleware, requirePermission("setup"), updateCustomer);
router.delete("/:id", authMiddleware, requirePermission("setup"), deleteCustomer);

module.exports = router;
