const express = require("express");
const router = express.Router();

const {
  createAgent,
  getAgents,
  updateAgent,
  deleteAgent,
  getAgentDashboard
} = require("../controllers/agentController");

const authMiddleware = require("../middleware/authMiddleware");
const { requirePermission } = require("../middleware/roleMiddleware");

/* ================= AGENT DASHBOARD ================= */
router.get("/dashboard", authMiddleware, getAgentDashboard);

/* ================= AGENT CRUD ================= */
router.post("/", authMiddleware, requirePermission("setup"), createAgent);
router.get("/", authMiddleware, getAgents);
router.put("/:id", authMiddleware, requirePermission("setup"), updateAgent);
router.delete("/:id", authMiddleware, requirePermission("setup"), deleteAgent);

module.exports = router;