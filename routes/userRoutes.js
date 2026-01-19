const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { requirePermission } = require("../middleware/roleMiddleware");
const { createUser, getUsersForSetup } = require("../controllers/userController");
const { deleteUser } = require('../controllers/userController');

// CREATE USER (admin with setup permission)
router.post("/", authMiddleware, requirePermission("setup"), createUser);

// GET ALL USERS FOR SETUP PAGE (admin only)
router.get("/", authMiddleware, requirePermission("setup"), getUsersForSetup);

router.delete("/:id", authMiddleware, requirePermission("setup"), deleteUser);


module.exports = router;