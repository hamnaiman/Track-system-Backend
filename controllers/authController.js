const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const Role = require("../models/roleModel");
const generateToken = require("../security/generateToken");

const MAX_FAILED = parseInt(process.env.MAX_FAILED_ATTEMPTS || "5", 10);
const LOCK_MINUTES = parseInt(process.env.LOCK_TIME_MINUTES || "10", 10);

exports.login = async (req, res) => {
  try {
    const { customerCode, userId, password } = req.body;
    if (!customerCode || !userId || !password) {
      return res.status(400).json({ message: "customerCode, userId and password required" });
    }

    const user = await User.findOne({ customerCode, userId }).populate("role");
    if (!user) return res.status(400).json({ message: "Invalid login details" });

    if (!user.isActive) return res.status(403).json({ message: "User is inactive" });

    if (user.isLocked()) {
      return res.status(403).json({ message: "Account locked. Try later." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      user.failedAttempts = (user.failedAttempts || 0) + 1;
      if (user.failedAttempts >= MAX_FAILED) {
        user.lockUntil = new Date(Date.now() + LOCK_MINUTES * 60 * 1000);
      }
      await user.save();
      return res.status(400).json({ message: "Incorrect password" });
    }

    // successful login
    user.failedAttempts = 0;
    user.lockUntil = null;
    await user.save();

    const token = generateToken(user);
    const permissions = user.getEffectivePermissions(user.role ? user.role.permissions : {});

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        userId: user.userId,
        fullName: user.fullName,
        email: user.email,
        role: user.role ? user.role.roleName : null,
        customerCode: user.customerCode,
        permissions
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
