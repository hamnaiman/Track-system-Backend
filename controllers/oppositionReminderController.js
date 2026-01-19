const OppositionReminder = require("../models/oppositionReminderModel");

/* ===============================
   CREATE REMINDER
================================ */
const createReminder = async (req, res) => {
  try {
    const {
      oppositionId,
      oppositionNumber,
      reminderDate,
      taskDescription
    } = req.body;

    if (!oppositionId || !oppositionNumber || !reminderDate || !taskDescription) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing"
      });
    }

    const reminder = await OppositionReminder.create({
      oppositionId,
      oppositionNumber,
      reminderDate,
      taskDescription,
      status: "Pending",
      createdBy: req.user._id
    });

    res.status(201).json({
      success: true,
      data: reminder
    });

  } catch (err) {
    console.error("Create Reminder Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

/* ===============================
   REMINDER REPORT
   (Document Aligned)
================================ */
const getReminderReport = async (req, res) => {
  try {
    const { startDate, endDate, clientId } = req.query;

    /* BASE FILTER */
    const filter = {
      status: "Pending"
    };

    /* DATE RANGE FILTER */
    if (startDate || endDate) {
      filter.reminderDate = {};

      if (startDate) {
        filter.reminderDate.$gte = new Date(startDate);
      }

      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.reminderDate.$lte = end;
      }
    }

    /* QUERY */
    const reminders = await OppositionReminder.find(filter)
      .populate({
        path: "oppositionId",
        match: clientId ? { clientId } : {},
        select: "oppositionNumber clientId",
        populate: {
          path: "clientId",
          select: "name"
        }
      })
      .sort({ reminderDate: 1 })
      .lean();

    /* REMOVE NON-MATCHED POPULATES */
    const data = reminders
      .filter(r => r.oppositionId)
      .map(r => ({
        _id: r._id,
        oppositionNumber: r.oppositionId.oppositionNumber,
        applicantName: r.oppositionId.clientId?.name || "-",
        reminderDate: r.reminderDate,
        taskDescription: r.taskDescription,
        createdAt: r.createdAt
      }));

    res.json({
      success: true,
      count: data.length,
      data
    });

  } catch (err) {
    console.error("Reminder Report Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

module.exports = {
  createReminder,
  getReminderReport
};
