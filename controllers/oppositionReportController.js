const mongoose = require("mongoose");
const Opposition = require("../models/oppositionModel");

const generateOppositionReport = async (req, res) => {
  try {
    const {
      oppositionNumber,
      startDate,
      endDate,
      oppositionType,
      status,
      clientId,
      trademark,
      journalNo
    } = req.query;

    const filter = {};

    /* 🔍 Opposition Number (partial, case-insensitive) */
    if (oppositionNumber) {
      filter.oppositionNumber = {
        $regex: oppositionNumber,
        $options: "i"
      };
    }

    /* 🔍 Opposition Type */
    if (oppositionType) {
      filter.oppositionType = oppositionType;
    }

    /* 🔍 Status */
    if (status) {
      filter.status = status;
    }

    /* 🔍 Trademark (partial) */
    if (trademark) {
      filter.trademark = {
        $regex: trademark,
        $options: "i"
      };
    }

    /* 🔍 Journal Number (STRING + PARTIAL SEARCH ✅) */
    if (journalNo) {
      filter.trademarkJournalNumber = {
        $regex: journalNo,
        $options: "i"
      };
    }

    /* 🔍 Client */
    if (clientId && mongoose.Types.ObjectId.isValid(clientId)) {
      filter.clientId = clientId;
    }

    /* 📅 Opposition Date Range */
    if (startDate || endDate) {
      filter.oppositionDate = {};

      if (startDate) {
        filter.oppositionDate.$gte = new Date(startDate);
      }

      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        filter.oppositionDate.$lte = end;
      }
    }

    /* 📦 FETCH DATA */
    const records = await Opposition.find(filter)
      .populate("clientId", "customerName")
      .sort({ oppositionDate: -1 })
      .lean();

    /* 🎯 RESPONSE */
    res.json({
      success: true,
      totalRecords: records.length,
      data: records.map((r, index) => ({
        srNo: index + 1,
        oppositionNumber: r.oppositionNumber,
        oppositionType: r.oppositionType,
        status: r.status,
        trademark: r.trademark || "-",
        journalNo: r.trademarkJournalNumber || "-",
        oppositionDate: r.oppositionDate,
        clientName: r.clientId?.customerName || "-"
      }))
    });

  } catch (error) {
    console.error("Opposition Report Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate opposition report"
    });
  }
};

module.exports = { generateOppositionReport };
