const Renewal = require("../models/renewalModel");
const Application = require("../models/applicationModel");
const Customer = require("../models/customerModel");

// TM Renewal Report
exports.getRenewalReport = async (req, res) => {
  try {
    const { fromDate, toDate, applicant } = req.body;

    if (!fromDate || !toDate) {
      return res.status(400).json({
        message: "Renewal From Date and Renewal To Date are required"
      });
    }

    // Parse date range
    const start = new Date(fromDate);
    const end = new Date(toDate);
    end.setHours(23, 59, 59);

    // Step 1: Fetch all renewals with entries within the date range
    const renewals = await Renewal.find({
      entries: {
        $elemMatch: {
          renewedUpto: { $gte: start, $lte: end }
        }
      }
    })
      .populate({
        path: "application",
        populate: [
          { path: "client", select: "customerName" },
          { path: "classes", select: "classNumber" }
        ]
      })
      .lean();

    // Step 2: Filter by client (optional)
    let filtered = renewals;
    if (applicant) {
      filtered = renewals.filter(r =>
        r.application.client?._id.toString() === applicant
      );
    }

    res.status(200).json({
      success: true,
      count: filtered.length,
      data: filtered
    });

  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};
