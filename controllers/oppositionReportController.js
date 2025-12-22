const Opposition = require("../models/oppositionReportModel");

/**
 * GENERATE OPPOSITION REPORT
 */
exports.generateOppositionReport = async (req, res) => {
  try {
    const {
      oppositionNumber,
      startDate,
      endDate,
      oppositionType,
      status,
      trademarkJournalNumber,
      clientId,
      trademark
    } = req.query;

    // ---------------- BUILD FILTER ----------------
    const filter = {};

    if (oppositionNumber)
      filter.oppositionNumber = new RegExp(oppositionNumber, "i");

    if (oppositionType)
      filter.oppositionType = oppositionType;

    if (status)
      filter.status = status;

    if (trademarkJournalNumber)
      filter.trademarkJournalNumber = trademarkJournalNumber;

    if (clientId)
      filter.clientId = clientId;

    if (trademark)
      filter.trademark = new RegExp(trademark, "i");

    // DATE RANGE
    if (startDate || endDate) {
      filter.filingDate = {};
      if (startDate) filter.filingDate.$gte = new Date(startDate);
      if (endDate) filter.filingDate.$lte = new Date(endDate);
    }

    // ---------------- QUERY ----------------
    const results = await Opposition.find(filter)
      .populate("clientId", "customerName")
      .sort({ filingDate: -1 });

    res.json({
      total: results.length,
      data: results
    });

  } catch (err) {
    console.error("Opposition Report Error:", err);
    res.status(500).json({
      message: "Failed to generate opposition report",
      error: err.message
    });
  }
};
