const Opposition = require("../models/oppositionModel");

/**
 * Single Opposition Query
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

      case "applicationNumber":
        filter.applicationNumber = value.trim();
        break;

      case "trademark":
        filter.trademark = new RegExp(value.trim(), "i");
        break;

      case "clientName":
        // handled via populate (below)
        break;

      default:
        return res.status(400).json({
          message: "Invalid search criteria"
        });
    }

    let query = Opposition.findOne(filter)
      .populate("clientId", "customerName customerCode")
      .lean();

    let opposition = await query;

    /* CLIENT NAME SEARCH (POST POPULATE FILTER) */
    if (searchBy === "clientName") {
      opposition = await Opposition.find()
        .populate("clientId", "customerName")
        .lean();

      opposition = opposition.find(o =>
        o.clientId?.customerName
          ?.toLowerCase()
          .includes(value.trim().toLowerCase())
      );
    }

    if (!opposition) {
      return res.status(404).json({
        message: "Opposition record not found"
      });
    }

    /* 🔥 NORMALIZED RESPONSE (Frontend Friendly) */
    res.json({
      success: true,
      data: {
        oppositionNumber: opposition.oppositionNumber,
        fileNumber: opposition.applicationNumber,
        oppositionDate: opposition.oppositionDate,
        oppositionType: opposition.oppositionType,
        status: opposition.status,
        remarks: opposition.remarks,
        applicationNumber: opposition.applicationNumber,
        trademark: opposition.trademark,
        goods: opposition.goods,
        journalNumber: opposition.trademarkJournalNumber,
        clientName: opposition.clientId?.customerName || "-"
      }
    });

  } catch (err) {
    console.error("Opposition Single Query Error:", err);
    res.status(500).json({
      message: "Server error while fetching opposition record"
    });
  }
};
