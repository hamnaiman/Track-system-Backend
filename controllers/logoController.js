const Logo = require("../models/logoModel");
const uploadToCloudinary = require("../utils/cloudinaryUpload");
const cloudinary = require("../utils/cloudinary");
const sharp = require("sharp");

// ================= UPLOAD LOGO =================
exports.uploadLogo = async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ message: "Logo file is required" });
    }

    // Dimension check
    const meta = await sharp(req.file.buffer).metadata();
    if (meta.width !== 210 || meta.height !== 110) {
      return res.status(400).json({
        message: "Logo must be exactly 210 × 110 pixels"
      });
    }

    // Remove old logo
    const existing = await Logo.findOne();
    if (existing?.publicId) {
      await cloudinary.uploader.destroy(existing.publicId, {
        resource_type: "image"
      });
      await existing.deleteOne();
    }

    // Upload to Cloudinary
    const result = await uploadToCloudinary(
      req.file.buffer,
      "system-logo"
    );

    const logo = await Logo.create({
      fileUrl: result.secure_url,
      publicId: result.public_id,
      mimeType: req.file.mimetype,
      size: req.file.size
    });

    res.json({
      message: "Logo uploaded successfully",
      data: logo
    });

  } catch (error) {
    console.error("Logo Upload Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ================= GET LOGO =================
exports.getLogo = async (req, res) => {
  try {
    const logo = await Logo.findOne().sort({ createdAt: -1 });
    if (!logo) {
      return res.status(404).end();
    }

    // Cloudinary direct access
    res.redirect(logo.fileUrl);

  } catch (error) {
    res.status(500).end();
  }
};
