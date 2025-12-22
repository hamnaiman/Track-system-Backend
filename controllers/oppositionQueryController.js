const Opposition = require("../models/oppositionReportModel");

/**
 * @desc    Get single opposition record (Single Query)
 * @route   GET /api/opposition/single-query
 * @access  Private (Admin / Authorized)
 */
exports.getOppositionSingleQuery = async (req, res) => {
  try {
    const { searchBy, value } = req.query;

    if (!searchBy || !value) {
      return res.status(400).json({
        message: "Search criteria and value are required"
      });
    }

    let filter = {};

    switch (searchBy) {
      case "oppositionNumber":
        filter.oppositionNumber = value.trim();
        break;

      case "clientName":
        filter.clientName = new RegExp(value.trim(), "i");
        break;

      case "trademark":
        filter.trademark = new RegExp(value.trim(), "i");
        break;

      case "applicationNumber":
        filter.applicationNumber = value.trim();
        break;

      default:
        return res.status(400).json({
          message: "Invalid search criteria"
        });
    }

    const opposition = await Opposition.findOne(filter)
      .populate("clientId", "customerName customerCode")
      .select(
        "oppositionNumber fileNumber oppositionDate oppositionType status remarks " +
        "applicationNumber trademark goods periodOfUse clientName createdAt"
      );

    if (!opposition) {
      return res.status(404).json({
        message: "Opposition record not found"
      });
    }

    res.json({
      success: true,
      data: opposition
    });

  } catch (err) {
    console.error("Opposition Single Query Error:", err);
    res.status(500).json({
      message: "Server error while fetching opposition record"
    });
  }
};
