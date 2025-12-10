const Role = require("../models/roleModel");

// ✅ CREATE ROLE (ADMIN ONLY)
exports.createRole = async (req, res) => {
  try {
    const { roleName, permissions } = req.body;

    if (!roleName) {
      return res.status(400).json({ message: "Role name is required" });
    }

    const exists = await Role.findOne({ roleName });
    if (exists) {
      return res.status(400).json({ message: "Role already exists" });
    }

    const role = await Role.create({
      roleName,
      permissions
    });

    res.status(201).json({
      success: true,
      message: "Role created successfully",
      data: role
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ✅ GET ALL ROLES (FOR DROPDOWN)
exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find();
    res.status(200).json({ success: true, data: roles });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
