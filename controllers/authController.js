const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = require("../models/userModel");
const Role = require("../models/roleModel");
const generateToken = require("../security/generateToken");
const sendEmail = require("../utils/sendEmail");

const MAX_FAILED = parseInt(process.env.MAX_FAILED_ATTEMPTS || "5", 10);
const LOCK_MINUTES = parseInt(process.env.LOCK_TIME_MINUTES || "10", 10);

/* ======================================================
   🔐 LOGIN
====================================================== */
exports.login = async (req, res) => {
  try {
    const { customerCode, userId, password } = req.body;

    if (!customerCode || !userId || !password)
      return res.status(400).json({ message: "All fields required" });

    const user = await User.findOne({ customerCode, userId }).populate("role");
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    if (!user.isActive)
      return res.status(403).json({ message: "User inactive" });

    if (user.isLocked())
      return res.status(403).json({ message: "Account locked. Try later." });

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      user.failedAttempts = (user.failedAttempts || 0) + 1;

      if (user.failedAttempts >= MAX_FAILED)
        user.lockUntil = new Date(Date.now() + LOCK_MINUTES * 60000);

      await user.save();
      return res.status(400).json({ message: "Wrong password" });
    }

    user.failedAttempts = 0;
    user.lockUntil = null;
    await user.save();

    const token = generateToken(user);

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role?.roleName,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ======================================================
   🔐 CHANGE PASSWORD
====================================================== */
exports.changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword)
      return res.status(400).json({ message: "All fields required" });

    if (newPassword !== confirmPassword)
      return res.status(400).json({ message: "Passwords do not match" });

    const strong = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!strong.test(newPassword))
      return res.status(400).json({ message: "Weak password" });

    const user = await User.findById(userId);

    const oldMatch = await bcrypt.compare(oldPassword, user.password);
    if (!oldMatch)
      return res.status(400).json({ message: "Old password incorrect" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();
    res.json({ success: true, message: "Password updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ======================================================
   🔐 FORGOT PASSWORD (EMAIL RESET LINK)
====================================================== */
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "Email not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 min

    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const message = `
      <h3>Password Reset Request</h3>
      <p>Click the link below to reset your password</p>
      <a href="${resetUrl}">${resetUrl}</a>
    `;

    await sendEmail(user.email, "Password Reset", message);

    res.json({ success: true, message: "Reset link sent to email" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ======================================================
   🔐 RESET PASSWORD
====================================================== */
exports.resetPassword = async (req, res) => {
  try {
    const resetToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user)
      return res.status(400).json({ message: "Token expired" });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(req.body.password, salt);

    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;

    await user.save();

    res.json({ success: true, message: "Password reset successful" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
