const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const Role = require("../models/roleModel");

// ---------------------- CREATE USER (ADMIN ONLY) ----------------------
exports.createUser = async (req, res) => {
  try {
    const admin = req.user; // logged-in admin user
    
    const { userId, fullName, email, roleId, password, permissionsOverride } = req.body;

    if (!userId || !fullName || !roleId || !password) {
      return res.status(400).json({ message: "userId, fullName, roleId and password are required." });
    }

    // Check if role exists
    const role = await Role.findById(roleId);
    if (!role) {
      return res.status(400).json({ message: "Invalid roleId." });
    }

    const customerCode = admin.customerCode;

    // Check if userId already exists under same customer
    const existing = await User.findOne({ customerCode, userId });
    if (existing) {
      return res.status(400).json({ message: "User ID already exists for this customer." });
    }

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({
      customerCode,
      userId,
      fullName,
      email,
      role: roleId,
      password: hashedPassword,
      permissionsOverride: permissionsOverride || {}
    });

    const userResponse = newUser.toObject();
    delete userResponse.password;

    return res.status(201).json({
      success: true,
      message: "User created successfully.",
      data: userResponse
    });

  } catch (err) {
    console.error("Create User Error:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};


// ---------------------- GET ALL USERS FOR ADMIN PAGE ----------------------
exports.getUsersForSetup = async (req, res) => {
  try {
    const admin = req.user;

    const users = await User.find({ customerCode: admin.customerCode })
      .populate("role", "roleName permissions")
      .select("-password -resetPasswordToken -resetPasswordExpire -otpCode -otpExpire");

    return res.status(200).json({
      success: true,
      data: users
    });

  } catch (err) {
    console.error("Fetch Users Error:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
};
