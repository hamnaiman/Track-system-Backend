const express = require("express");
const router = express.Router();

const {
  createApplication,
  getApplications,
  updateApplication,
  deleteApplication
} = require("../controllers/applicationController");

const authMiddleware = require("../middleware/authMiddleware");
const { requirePermission } = require("../middleware/roleMiddleware");

router.post("/", authMiddleware, requirePermission("setup"), createApplication);

router.get("/", authMiddleware, getApplications);

router.put("/:id", authMiddleware, requirePermission("setup"), updateApplication);

router.delete("/:id", authMiddleware, requirePermission("setup"), deleteApplication);

module.exports = router;
