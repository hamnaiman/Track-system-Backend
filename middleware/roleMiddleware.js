const Role = require("../models/roleModel");

/* =====================================================
   REQUIRE ROLE (STRICT)
===================================================== */
const requireRole = (roleName) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (req.user.role?.roleName?.toLowerCase() === roleName.toLowerCase()) {
      return next();
    }

    return res.status(403).json({ message: "Insufficient role" });
  };
};

/* =====================================================
   REQUIRE PERMISSION (SECURE)
   Only checks relevant permissions: view, add, edit, delete, print
   setup is ignored
===================================================== */
const requirePermission = (permKey) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // 🔥 ADMIN = FULL ACCESS
    if (req.user.role.roleName.toLowerCase() === "admin") {
      return next();
    }

    const perms = req.user.permissions || {};

    console.log("🔐 PERMISSION CHECK:", {
      userId: req.user.userId,
      role: req.user.role.roleName,
      required: permKey,
      permissions: perms
    });

    if (Array.isArray(permKey)) {
      const allowed = permKey.some(p => perms[p] === true);
      if (allowed) return next();
    } else {
      if (perms[permKey] === true) return next();
    }

    return res.status(403).json({ message: "Insufficient permissions" });
  };
};

module.exports = {
  requireRole,
  requirePermission
};
