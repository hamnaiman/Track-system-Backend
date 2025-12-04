const Application = require("../models/applicationModel");
const Customer = require("../models/customerModel");

exports.basicSearchReport = async (req, res) => {
  try {
    const {
      searchBy,
      startDate,
      endDate,
      trademark,
      applicant,
      applicationNo,
      classFrom,
      classTo,
      journalNo,
      country,
      agent,
      businessType,
      status,
      reportType  // summary | details
    } = req.body;

    let query = {};

    // DATE FILTERING
    if (searchBy === "DateOfFiling" && startDate && endDate) {
      query.dateOfFiling = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    // TRADEMARK
    if (trademark) {
      query.trademark = { $regex: trademark, $options: "i" };
    }

    // APPLICANT
    if (applicant) {
      query.client = applicant;
    }

    // APPLICATION NUMBER
    if (applicationNo) {
      query.applicationNumber = applicationNo;
    }

    // CLASS RANGE
    if (classFrom && classTo) {
      query.classes = { $gte: Number(classFrom), $lte: Number(classTo) };
    }

    // JOURNAL NUMBER
    if (journalNo) {
      query.journalNumber = journalNo;
    }

    // COUNTRY
    if (country) {
      query.country = country;
    }

    // AGENT
    if (agent) {
      query.agent = agent;
    }

    // BUSINESS TYPE
    if (businessType) {
      query.businessType = businessType;
    }

    // STATUS (File Status)
    if (status) {
      query.status = status;
    }

    // BASE QUERY
    let applications = Application.find(query)
      .populate("client", "customerName")
      .populate("country", "name")
      .populate("agent", "agentName")
      .populate("status", "description")
      .populate("businessType", "name");

    // DETAILED REPORT → INCLUDE extra modules
    if (reportType === "details") {
      applications = applications
        .populate("hearings")
        .populate("tmForms")
        .populate("journals")
        .populate("renewals");
    }

    const result = await applications.sort({ dateOfFiling: 1 });

    res.status(200).json({
      success: true,
      count: result.length,
      data: result
    });

  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};
