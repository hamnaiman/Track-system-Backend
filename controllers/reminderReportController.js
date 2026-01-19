const Application = require("../models/applicationModel");

exports.getReminderReport = async (req, res) => {
  try {
    const { fromDate, toDate, applicant } = req.body;

    if (!fromDate || !toDate) {
      return res.status(400).json({
        message: "Reminder From Date and To Date are required."
      });
    }

    let filter = {
      reminderDate: {
        $gte: new Date(fromDate),
        $lte: new Date(toDate)
      }
    };

    // Filter by Applicant (Customer)
    if (applicant && applicant !== "all") {
      filter.client = applicant;
    }

    const reminders = await Application.find(filter)
      .populate("client", "customerName")
      .select(
        "applicationNumber fileNumber trademark goods reminderDate reminderRemark"
      )
      .sort({ reminderDate: 1 });

    res.status(200).json({
      success: true,
      count: reminders.length,
      data: reminders
    });

  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};
