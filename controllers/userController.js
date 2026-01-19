
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const Role = require("../models/roleModel");

const generateUserId = () =>
  "USR-" + Math.floor(100000 + Math.random() * 900000);

const generatePassword = () =>
  Math.random().toString(36).slice(-8);

// ---------------- CREATE USER ----------------
exports.createUser = async (req, res) => {
  try {
    const admin = req.user;
    const { fullName, email, roleId, permissionsOverride } = req.body;

    if (!fullName || !roleId) {
      return res.status(400).json({ message: "fullName and roleId are required" });
    }

    const role = await Role.findById(roleId);
    if (!role) {
      return res.status(400).json({ message: "Invalid roleId" });
    }

    const customerCode = admin.customerCode;

    let userId;
    do {
      userId = generateUserId();
    } while (await User.findOne({ customerCode, userId }));

    const plainPassword = generatePassword();
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    await User.create({
      customerCode,
      userId,
      fullName,
      email,
      role: roleId,
      password: hashedPassword,
      permissionsOverride: permissionsOverride || {},
    });

    return res.status(201).json({
      success: true,
      credentials: {
        userId,
        password: plainPassword,
      },
    });
  } catch (err) {
    console.error("Create User Error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ---------------- GET USERS ----------------
exports.getUsersForSetup = async (req, res) => {
  try {
    const users = await User.find({ customerCode: req.user.customerCode })
      .populate("role", "roleName permissions")
      .select("-password");

    res.status(200).json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};



exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};