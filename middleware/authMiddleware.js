const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Agent = require("../models/agentModel");

/* ================= PERMISSION MERGE ================= */
const mergePermissions = (rolePerms = {}, overridePerms = {}) => ({
  view: overridePerms?.view ?? rolePerms?.view ?? true,
  add: overridePerms?.add ?? rolePerms?.add ?? false,
  edit: overridePerms?.edit ?? rolePerms?.edit ?? false,
  delete: overridePerms?.delete ?? rolePerms?.delete ?? false,
  print: overridePerms?.print ?? rolePerms?.print ?? false
});

const authMiddleware = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    /* =================================================
       1️⃣ TRY USER / ADMIN (ORIGINAL LOGIC)
    ================================================= */
    const user = await User.findById(decoded.id).populate(
      "role",
      "roleName permissions"
    );

    if (user) {
      if (!user.isActive) {
        return res.status(403).json({ message: "User is inactive" });
      }

      const finalPermissions = mergePermissions(
        user.role?.permissions || {},
        user.permissionsOverride || {}
      );

      req.user = {
        _id: user._id,
        id: user._id,
        userId: user.userId,
        fullName: user.fullName,
        email: user.email,

        customerCode: user.customerCode, // ✅ STRING BASED (PEX-ADMIN)

        role: {
          _id: user.role?._id,
          roleName: user.role?.roleName
        },

        permissions: finalPermissions,
        isAgent: false
      };

      return next();
    }

    /* =================================================
       2️⃣ TRY AGENT (NEW SUPPORT)
    ================================================= */
    const agent = await Agent.findById(decoded.id);

    if (!agent) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // 🔥 Normalize agent same as user
    req.user = {
      _id: agent._id,
      id: agent._id,
      userId: agent.userId,
      fullName: agent.agentName,
      email: agent.email,

      customerCode: agent.customerCode || "PEX-ADMIN",

      role: {
        roleName: "agent"
      },

      permissions: {
        view: true,
        add: false,
        edit: false,
        delete: false,
        print: false
      },

      isAgent: true
    };

    next();

  } catch (err) {
    console.log("AUTH ERROR:", err.message);
    return res.status(401).json({
      message: "Unauthorized",
      error: err.message
    });
  }
};

module.exports = authMiddleware;
