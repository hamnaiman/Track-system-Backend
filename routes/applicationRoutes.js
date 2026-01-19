const express = require("express");
const router = express.Router();

const {
  createApplication,
  getApplications,
  getApplicationById,
  updateApplication,
  deleteApplication,
  getMyApplications
} = require("../controllers/applicationController");

const authMiddleware = require("../middleware/authMiddleware");
const { requirePermission } = require("../middleware/roleMiddleware");

/* =====================================================
   USER ROUTES — MUST BE FIRST
===================================================== */

// USER: View & Print only
router.get(
  "/my-applications",
  authMiddleware,
  requirePermission("view"),   // ✅ IMPORTANT
  getMyApplications
);

/* =====================================================
   ADMIN ROUTES
===================================================== */

// ADMIN: CREATE
router.post(
  "/",
  authMiddleware,
  requirePermission("setup"),
  createApplication
);

// ADMIN: GET ALL
router.get(
  "/",
  authMiddleware,
  requirePermission("view"),   // 🔥 restrict user bleed
  getApplications
);

// ADMIN: UPDATE
router.put(
  "/:id",
  authMiddleware,
  requirePermission("setup"),
  updateApplication
);

// ADMIN: DELETE
router.delete(
  "/:id",
  authMiddleware,
  requirePermission("setup"),
  deleteApplication
);

/* =====================================================
   COMMON — MUST BE LAST
===================================================== */

// USER + ADMIN: View single application
router.get(
  "/:id",
  authMiddleware,
  requirePermission("view"),
  getApplicationById
);

module.exports = router;
