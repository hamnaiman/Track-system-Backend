const OppositionReminder = require("../models/oppositionReminderModel");
const Opposition = require("../models/oppositionReportModel");

// ================= CREATE REMINDER =================
exports.createReminder = async (req, res) => {
  try {
    const { oppositionNumber, reminderDate, taskDescription } = req.body;

    if (!oppositionNumber || !reminderDate || !taskDescription) {
      return res.status(400).json({
        message: "Opposition number, reminder date and task are required"
      });
    }

    const opposition = await Opposition.findOne({ oppositionNumber });
    if (!opposition) {
      return res.status(404).json({ message: "Opposition not found" });
    }

    const reminder = await OppositionReminder.create({
      oppositionId: opposition._id,
      oppositionNumber,
      reminderDate,
      taskDescription,
      createdBy: req.user._id
    });

    res.status(201).json({
      message: "Reminder created successfully",
      data: reminder
    });

  } catch (err) {
    console.error("Create Reminder Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= REMINDER REPORT =================
exports.getReminderReport = async (req, res) => {
  try {
    const {
      startDate,
      endDate,
      applicant,
      status = "Pending"
    } = req.query;

    let filter = {};

    if (startDate || endDate) {
      filter.reminderDate = {};
      if (startDate) filter.reminderDate.$gte = new Date(startDate);
      if (endDate) filter.reminderDate.$lte = new Date(endDate);
    }

    if (status) filter.status = status;
    if (applicant) filter.applicant = applicant;

    const reminders = await OppositionReminder.find(filter)
      .select("oppositionNumber reminderDate taskDescription status createdAt")
      .sort({ reminderDate: 1 });

    res.json({
      count: reminders.length,
      data: reminders
    });

  } catch (err) {
    console.error("Reminder Report Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
