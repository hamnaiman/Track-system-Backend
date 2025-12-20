const Logo = require("../models/logoModel");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

exports.uploadLogo = async (req, res) => {
  try {
    // 1️⃣ File validation
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({
        message: "Logo file is required"
      });
    }

    // 2️⃣ Read buffer with sharp
    const image = sharp(req.file.buffer);
    const metadata = await image.metadata();

    // 3️⃣ Dimension check (same as before)
    if (metadata.width !== 210 || metadata.height !== 110) {
      return res.status(400).json({
        message: "Logo must be exactly 210×110 pixels"
      });
    }

    // 4️⃣ Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), "uploads", "logo");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // 5️⃣ Generate filename
    const fileName = `company_logo_${Date.now()}.png`;
    const relativePath = `/uploads/logo/${fileName}`;
    const absolutePath = path.join(uploadDir, fileName);

    // 6️⃣ Save optimized PNG from BUFFER
    await image
      .png({ quality: 90 })
      .toFile(absolutePath);

    // 7️⃣ Remove old logo (DB + file)
    const old = await Logo.findOne();
    if (old?.logoUrl) {
      const oldFilePath = path.join(process.cwd(), old.logoUrl);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
      await Logo.findByIdAndDelete(old._id);
    }

    // 8️⃣ Save new logo entry
    const newLogo = await Logo.create({
      logoUrl: relativePath
    });

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

// ---------------- GET LOGO ----------------
exports.getLogo = async (req, res) => {
  try {
    const logo = await Logo.findOne();
    res.status(200).json({
      success: true,
      logo
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};
