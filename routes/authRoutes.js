const express = require("express");
const router = express.Router();

const {
  login,
  changePassword,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

const auth = require("../middleware/authMiddleware");

// 🔐 LOGIN
router.post("/login", login);

// 🔐 CHANGE PASSWORD (Protected)
router.post("/change-password", auth, changePassword);

// 🔐 FORGOT PASSWORD
router.post("/forgot-password", forgotPassword);

// 🔐 RESET PASSWORD
router.post("/reset-password/:token", resetPassword);

module.exports = router;
