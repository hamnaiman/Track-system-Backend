const Role = require("../models/roleModel");

/* =====================================================
   REQUIRE ROLE (STRICT ROLE CHECK)
===================================================== */
const requireRole = (roleName) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const userRole = req.user.role;
      if (!userRole) {
        return res.status(403).json({ message: "No role assigned" });
      }

      // ✅ If role already populated
      if (typeof userRole === "object" && userRole.roleName) {
        if (userRole.roleName === roleName) return next();
      } 
      else {
        // ✅ If role ID only
        const roleDoc = await Role.findById(userRole);

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
      return res.status(500).json({
        message: "Internal role verification error"
      });
    }
  };
};


/* =====================================================
   REQUIRE PERMISSION (ADMIN = FULL ACCESS)
===================================================== */
const requirePermission = (permKey) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      // ✅ ✅ ✅ ADMIN HAS FULL ACCESS
      if (req.user.role?.roleName === "Admin") {
        return next();
      }

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

      // 🔍 AUDIT LOG (SAFE TO KEEP)
      console.log("=== 🔐 Permission Check ===");
      console.log("User ID:", req.user._id);
      console.log("Login ID:", req.user.userId);
      console.log("Role:", req.user.role?.roleName);
      console.log("Requested:", permKey);
      console.log("Effective:", effective);
      console.log("==========================");

      // ✅ MULTI-PERMISSION SUPPORT
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
      return res.status(500).json({
        message: "Internal permission verification error"
      });
    }
  };
};

module.exports = {
  requireRole,
  requirePermission
};
