const Role = require("../models/roleModel");

// ------------------- requireRole -------------------
const requireRole = (roleName) => {
  return async (req, res, next) => {
    try {
      if (!req.user)
        return res.status(401).json({ message: "Unauthorized" });

      const userRole = req.user.role;
      if (!userRole)
        return res.status(403).json({ message: "No role assigned" });

      // ✅ If populated role object
      if (typeof userRole === "object" && userRole.roleName) {
        if (userRole.roleName === roleName) return next();
      }
      else {
        // ✅ If only role ID present
        const roleDoc = await Role.findById(userRole);

        // ✅ FAIL SAFE
        if (!roleDoc) {
          return res.status(403).json({
            message: "Assigned role no longer exists. Contact administrator."
          });
        }

        if (roleDoc.roleName === roleName) return next();
      }

      return res.status(403).json({ message: "Insufficient role" });

    } catch (err) {
      console.error("Role Middleware Error:", err);
      return res.status(500).json({ message: "Internal role verification error" });
    }
  };
};


// ------------------- requirePermission -------------------
const requirePermission = (permKey) => {
  return async (req, res, next) => {
    try {
      if (!req.user)
        return res.status(401).json({ message: "Unauthorized" });

      const rolePerms = req.user.role?.permissions || {};
      const override = req.user.permissionsOverride || {};

      // ✅ EFFECTIVE PERMISSION MERGE
      const effective = {
        add: override.add ?? rolePerms.add,
        edit: override.edit ?? rolePerms.edit,
        delete: override.delete ?? rolePerms.delete,
        print: override.print ?? rolePerms.print,
        view: override.view ?? rolePerms.view,
        setup: override.setup ?? rolePerms.setup
      };

      // ✅ ✅ ✅ AUDIT LOG (VERY IMPORTANT FOR ENTERPRISE SYSTEM)
      console.log("=== 🔐 Permission Check ===");
      console.log("User DB ID:", req.user._id);
      console.log("User Login ID:", req.user.userId);
      console.log("Permission Requested:", permKey);
      console.log("Role Name:", req.user.role?.roleName || "N/A");
      console.log("Role Permissions:", rolePerms);
      console.log("Override Permissions:", override);
      console.log("Final Effective:", effective);
      console.log("==========================");

      // ✅ ✅ MULTI PERMISSION SUPPORT (future safe)
      if (Array.isArray(permKey)) {
        const allowed = permKey.some(p => effective[p] === true);
        if (allowed) return next();
      }
      else {
        if (effective[permKey] === true) return next();
      }

      return res.status(403).json({ message: "Insufficient permissions" });

    } catch (err) {
      console.error("Permission Middleware Error:", err);
      return res.status(500).json({ message: "Internal permission verification error" });
    }
  };
};

module.exports = { requireRole, requirePermission };
