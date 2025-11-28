const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const Role = require("../models/roleModel");

// Admin creates user. Admin's customerCode is used automatically.
exports.createUser = async (req, res) => {
  try {
    // req.user is admin performing action (authMiddleware)
    const creator = req.user;
    // ensure creator has permissions (this endpoint should be protected by requirePermission('setup') or role)
    const { userId, fullName, email, roleId, password, permissionsOverride } = req.body;
    if (!userId || !fullName || !roleId || !password) {
      return res.status(400).json({ message: "userId, fullName, roleId and password are required" });
    }

    // ensure role exists
    const role = await Role.findById(roleId);
    if (!role) return res.status(400).json({ message: "Invalid roleId" });

    const customerCode = creator.customerCode; // assigned automatically

    // check unique per customer
    const existing = await User.findOne({ customerCode, userId });
    if (existing) return res.status(400).json({ message: "User ID already exists for this customer" });

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || "10", 10);
    const hashed = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({
      customerCode,
      userId,
      fullName,
      email,
      role: roleId,
      password: hashed,
      permissionsOverride: permissionsOverride || {}
    });

    // Do not return password
    const userObj = newUser.toObject();
    delete userObj.password;
    res.status(201).json({ success: true, message: "User created", data: userObj });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
