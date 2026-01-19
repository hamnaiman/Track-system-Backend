const Application = require("../models/applicationModel");

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
      reportType
    } = req.body;

    // 🔐 CUSTOMER ISOLATION (VERY IMPORTANT)
    let query = {
      customerCode: req.user.customerCode
    };

    // DATE FILTER
    if (searchBy === "DateOfFiling" && startDate && endDate) {
      query.dateOfFiling = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    if (trademark) {
      query.trademark = { $regex: trademark, $options: "i" };
    }

    if (applicant) {
      query.client = applicant;
    }

    if (applicationNo) {
      query.applicationNumber = applicationNo;
    }

    // ✅ FIXED CLASS RANGE
    if (classFrom && classTo) {
      query.classes = {
        $elemMatch: {
          $gte: Number(classFrom),
          $lte: Number(classTo)
        }
      };
    }

    if (journalNo) {
      query.journalNumber = journalNo;
    }

    if (country) {
      query.country = country;
    }

    if (agent) {
      query.agent = agent;
    }

    if (businessType) {
      query.businessType = businessType;
    }

    if (status) {
      query.status = status;
    }

    let applicationsQuery = Application.find(query)
      .populate("client", "customerName")
      .populate("country", "name")
      .populate("agent", "agentName")
      .populate("status", "description")
      .populate("businessType", "name")
      .sort({ dateOfFiling: 1 });

    // ❗ ONLY populate if fields EXIST in schema
    if (reportType === "details") {
      // uncomment ONLY if these refs exist in Application schema
      // applicationsQuery = applicationsQuery.populate("hearings");
      // applicationsQuery = applicationsQuery.populate("tmForms");
      // applicationsQuery = applicationsQuery.populate("journals");
      // applicationsQuery = applicationsQuery.populate("renewals");
    }

    const result = await applicationsQuery;

    res.status(200).json({
      success: true,
      count: result.length,
      data: result
    });

  } catch (err) {
    console.error("BASIC SEARCH REPORT ERROR:", err);
    res.status(500).json({
      message: "Failed to generate basic search report",
      error: err.message
    });
  }
};
