const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const authMiddleware = async (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    if (!header.startsWith("Bearer ")) return res.status(401).json({ message: "No token provided" });

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // fetch fresh user
    const user = await User.findById(decoded.id).populate("role");
    if (!user) return res.status(401).json({ message: "Invalid token: user not found" });
    if (!user.isActive) return res.status(403).json({ message: "User is inactive" });
    req.user = user; // attach full user doc
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized", error: err.message });
  }
};

module.exports = authMiddleware;
