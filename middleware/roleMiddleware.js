// middleware/roleMiddleware.js

const Role = require("../models/roleModel");

// ------------------- requireRole -------------------
const requireRole = (roleName) => {
  return async (req, res, next) => {

    if (!req.user) 
      return res.status(401).json({ message: "Unauthorized" });

    const userRole = req.user.role;
    if (!userRole) 
      return res.status(403).json({ message: "No role assigned" });

    // If populated object
    if (typeof userRole === "object" && userRole.roleName) {
      if (userRole.roleName === roleName) return next();
    } 
    else {
      // If ID only
      const roleDoc = await Role.findById(userRole);
      if (roleDoc && roleDoc.roleName === roleName) return next();
    }

    return res.status(403).json({ message: "Insufficient role" });
  };
};


// ------------------- requirePermission -------------------
const requirePermission = (permKey) => {
  return async (req, res, next) => {

    if (!req.user) 
      return res.status(401).json({ message: "Unauthorized" });

    // Ensure role permissions are plain object
    const rolePerms = req.user.role?.permissions || {};

    // Ensure override is plain object
    const override = req.user.permissionsOverride || {};

    // Build final effective permissions structure
    const effective = {
      add: override.add ?? rolePerms.add,
      edit: override.edit ?? rolePerms.edit,
      delete: override.delete ?? rolePerms.delete,
      print: override.print ?? rolePerms.print,
      view: override.view ?? rolePerms.view,
      setup: override.setup ?? rolePerms.setup
    };

    // 🔍 DEBUG LOGS (Do not remove)
    console.log("=== Permission Check Debug ===");
    console.log("Logged-in User ID:", req.user._id);
    console.log("UserID:", req.user.userId);
    console.log("Permission Key:", permKey);
    console.log("Role Object:", req.user.role);
    console.log("Role Permissions:", rolePerms);
    console.log("Override Permissions:", override);
    console.log("Effective Permissions:", effective);
    console.log("==============================");

    // FINAL PERMISSION CHECK
    if (effective[permKey] === true) return next();

    return res.status(403).json({ message: "Insufficient permissions" });
  };
};

module.exports = { requireRole, requirePermission };
