const Logo = require("../models/logoModel");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

exports.uploadLogo = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Logo file is required" });
    }

    // Read image buffer and check dimensions
    const image = sharp(req.file.buffer);
    const metadata = await image.metadata();

    if (metadata.width !== 210 || metadata.height !== 110) {
      return res.status(400).json({
        message: "Logo must be exactly 210×110 pixels"
      });
    }

    // Generate file name
    const fileName = `company_logo_${Date.now()}.png`;
    const filePath = path.join("uploads/logo", fileName);

    // Save optimized png
    await image.png({ quality: 90 }).toFile(filePath);

    // Remove old logo from DB & file system
    const old = await Logo.findOne();
    if (old) {
      const oldPath = path.join(__dirname, "..", old.logoUrl);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      await Logo.findByIdAndDelete(old._id);
    }

    // Save new entry
    const newLogo = await Logo.create({ logoUrl: filePath });

    res.status(200).json({
      success: true,
      message: "Logo updated successfully",
      data: newLogo
    });

  } catch (error) {
    console.error("Upload Logo Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// Fetch current logo
exports.getLogo = async (req, res) => {
  try {
    const logo = await Logo.findOne();
    res.json({ success: true, logo });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};