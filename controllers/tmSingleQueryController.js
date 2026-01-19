const Application = require("../models/applicationModel");

exports.tmSingleQueryReport = async (req, res) => {
  try {
    const { searchBy, value } = req.body;
    const user = req.user;

    if (!searchBy || !value) {
      return res.status(400).json({ message: "Search field required" });
    }

    /* ================= SEARCH FILTER ================= */
    let filter = {};

    switch (searchBy) {
      case "applicationNumber":
        filter.applicationNumber = value.trim();
        break;

      case "fileNumber":
        filter.fileNumber = value.trim();
        break;

      case "trademark":
        filter.trademark = { $regex: value.trim(), $options: "i" };
        break;

      default:
        return res.status(400).json({ message: "Invalid search type" });
    }

    /* ================= DB QUERY ================= */
    const application = await Application.findOne(filter)
      .populate("client", "customerName")
      .populate("status", "description")
      .lean();

    if (!application) {
      return res.json({
        data: null,
        message: "No record found"
      });
    }

    /* ================= PRINT PERMISSION ================= */
    const allowPrint =
      user.role?.roleName === "admin" ||
      user.permissions?.print === true;

    return res.status(200).json({
      success: true,
      data: application,
      meta: {
        allowPrint
      }
    });

  } catch (error) {
    console.error("TM SINGLE QUERY ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
