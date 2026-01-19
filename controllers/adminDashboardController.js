const User = require("../models/userModel");
const Application = require("../models/applicationModel");
const Hearing = require("../models/hearingModel");
const Opposition = require("../models/oppositionModel");
const Renewal = require("../models/renewalModel");
const FileStatus = require("../models/fileStatusModel");

// ✅ ONLY EXISTING MODEL
const OppositionReminder = require("../models/oppositionReminderModel");

exports.getAdminDashboard = async (req, res) => {
  try {
    /* ================= STATUS ================= */
    const pendingStatus = await FileStatus.findOne({ name: "Pending" });

    /* ================= KPIs ================= */
    const [
      totalUsers,
      totalApplications,
      pendingCases,
      hearingsScheduled,
      totalOppositions,
      totalRenewals
    ] = await Promise.all([
      User.countDocuments(),
      Application.countDocuments(),
      pendingStatus
        ? Application.countDocuments({ status: pendingStatus._id })
        : 0,
      Hearing.countDocuments({ hearingDate: { $gte: new Date() } }),
      Opposition.countDocuments(),
      Renewal.countDocuments()
    ]);

    /* ================= APPLICATION STATUS BAR ================= */
    const applicationStats = await Application.aggregate([
      {
        $lookup: {
          from: "filestatuses",
          localField: "status",
          foreignField: "_id",
          as: "status"
        }
      },
      { $unwind: "$status" },
      {
        $group: {
          _id: "$status.name",
          value: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          name: "$_id",
          value: 1
        }
      }
    ]);

    /* ================= MONTHLY APPLICATION GRAPH ================= */
    const monthlyApplicationsAgg = await Application.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          value: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const monthlyApplications = monthlyApplicationsAgg.map(item => ({
      name: `${item._id.month}-${item._id.year}`,
      value: item.value
    }));

    /* ================= CASE DISTRIBUTION ================= */
    const caseDistribution = [
      { name: "Applications", value: totalApplications },
      { name: "Oppositions", value: totalOppositions },
      { name: "Renewals", value: totalRenewals }
    ];

    /* =====================================================
       🔔 REMINDERS (ADMIN – FIXED, SAFE)
       ===================================================== */

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    /* 🔹 APPLICATION REMINDERS */
    const appToday = await Application.countDocuments({
      reminderDate: {
        $gte: todayStart,
        $lte: todayEnd
      }
    });

    const appOverdue = await Application.countDocuments({
      reminderDate: { $lt: todayStart }
    });

    /* 🔹 OPPOSITION REMINDERS */
    const oppToday = await OppositionReminder.countDocuments({
      status: "Pending",
      reminderDate: {
        $gte: todayStart,
        $lte: todayEnd
      }
    });

    const oppOverdue = await OppositionReminder.countDocuments({
      status: "Pending",
      reminderDate: { $lt: todayStart }
    });

    /* ================= RESPONSE ================= */
    res.status(200).json({
      kpis: {
        totalUsers,
        totalApplications,
        pendingCases,
        hearingsScheduled,
        totalOppositions,
        totalRenewals
      },
      applicationStats,
      monthlyApplications,
      caseDistribution,

      // 🔔 ADMIN DASHBOARD REMINDERS
      reminders: {
        today: appToday + oppToday,
        overdue: appOverdue + oppOverdue,
        breakdown: {
          applications: {
            today: appToday,
            overdue: appOverdue
          },
          oppositions: {
            today: oppToday,
            overdue: oppOverdue
          }
        }
      }
    });

  } catch (error) {
    console.error("Admin Dashboard Error:", error);
    res.status(500).json({ message: "Dashboard data fetch failed" });
  }
};

