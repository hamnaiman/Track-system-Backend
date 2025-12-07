const express = require("express");
const router = express.Router();

const {
  login,
  changePassword,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

const auth = require("../middleware/authMiddleware");

router.post("/login", login);
router.post("/change-password", auth, changePassword);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

module.exports = router;
