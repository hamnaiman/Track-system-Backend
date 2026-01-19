const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const auth = require("../middleware/authMiddleware");

const { requireRole } = require("../middleware/roleMiddleware");

const {
  uploadUserManual,
  downloadUserManual
} = require("../controllers/usermanual.controller");

// ADMIN ONLY
router.post(
  "/admin/user-manual",
  auth,
  requireRole("Admin"), // ✅ CORRECT
  upload.single("manual"),
  uploadUserManual
);

// USER (ALL LOGGED IN USERS)
router.get(
  "/user/user-manual",
  auth,
  downloadUserManual
);

module.exports = router;
