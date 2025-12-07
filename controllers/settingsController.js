const Settings = require("../models/settingsModel");

// ---------------------------
// 📌 Get Current Date Format
// ---------------------------
exports.getDateFormat = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({}); // create default
    }

    res.status(200).json({
      success: true,
      dateFormat: settings.dateFormat
    });

  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};

// ---------------------------
// 📌 Update Date Format
// ---------------------------
exports.updateDateFormat = async (req, res) => {
  try {
    const { dateFormat } = req.body;

    const allowedFormats = ["MM/dd/yyyy", "dd/MM/yyyy"];
    
    // Validate input
    if (!allowedFormats.includes(dateFormat)) {
      return res.status(400).json({
        message: "Invalid date format. Choose MM/dd/yyyy or dd/MM/yyyy"
      });
    }

    let settings = await Settings.findOne();

    if (!settings) {
      settings = await Settings.create({ dateFormat });
    } else {
      settings.dateFormat = dateFormat;
      await settings.save();
    }

    res.status(200).json({
      success: true,
      message: "Date format updated successfully",
      dateFormat: settings.dateFormat
    });

  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};
