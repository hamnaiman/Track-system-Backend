const express = require("express");
const router = express.Router();
const { createAgent, getAgents, updateAgent, deleteAgent } = require("../controllers/agentController");

const authMiddleware = require("../middleware/authMiddleware");
const { requirePermission } = require("../middleware/roleMiddleware");

// Admin only — setup permission
router.post("/", authMiddleware, requirePermission("setup"), createAgent);
router.get("/", authMiddleware, getAgents);
router.put("/:id", authMiddleware, requirePermission("setup"), updateAgent);
router.delete("/:id", authMiddleware, requirePermission("setup"), deleteAgent);

module.exports = router;
