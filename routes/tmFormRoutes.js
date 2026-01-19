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

/*
  PERMISSION LOGIC:
  - view   → GET
  - add    → POST
  - edit   → PUT
  - delete → DELETE
*/

router.get(
  "/",
  authMiddleware,
  requirePermission("view"),
  getTMForms
);

router.post(
  "/",
  authMiddleware,
  requirePermission("add"),
  createTMForm
);

router.put(
  "/:id",
  authMiddleware,
  requirePermission("edit"),
  updateTMForm
);

router.delete(
  "/:id",
  authMiddleware,
  requirePermission("delete"),
  deleteTMForm
);

module.exports = router;
