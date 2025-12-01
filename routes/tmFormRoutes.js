const express = require("express");
const router = express.Router();

const {
  createTMForm,
  getTMForms,
  updateTMForm,
  deleteTMForm
} = require("../controllers/tmFormController");

const authMiddleware = require("../middleware/authMiddleware");
const { requirePermission } = require("../middleware/roleMiddleware");

// Only admin/setup can create/update/delete
router.post("/", authMiddleware, requirePermission("setup"), createTMForm);
router.get("/", authMiddleware, getTMForms);
router.put("/:id", authMiddleware, requirePermission("setup"), updateTMForm);
router.delete("/:id", authMiddleware, requirePermission("setup"), deleteTMForm);

module.exports = router;
