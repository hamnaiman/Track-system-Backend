const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authMiddleware = async (req, res, next) => {
  try {
    // 🔍 Debug (temporary – can remove later)
    console.log("AUTH HEADER RECEIVED:", req.headers.authorization);

    const header = req.headers.authorization || "";
    if (!header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("DECODED TOKEN:", decoded);

    // 🔐 Fetch fresh user from DB
    const user = await User.findById(decoded.id)
      .populate("role");

    if (!user) {
      return res.status(401).json({ message: "Invalid token: user not found" });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: "User is inactive" });
    }

    /* ================= IMPORTANT FIX ================= */

    /**
     * Application.client is ObjectId
     * So we MUST attach an ObjectId to req.user.customerId
     *
     * Assumption (most common & correct):
     * - User itself represents the client/customer
     * - Application.client references User._id
     */

    req.user = user;
    req.user.customerId = user._id;      // ✅ ObjectId (FIX)
    req.user.customerCode = user.customerCode; // optional, for display only

    /* ================================================= */

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
