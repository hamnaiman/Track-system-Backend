const Application = require("../models/applicationModel");
const Journal = require("../models/journalModel");
const MonthlyJournal = require("../models/monthlyJournalModel");

/* ================= HELPER ================= */
const matchString = (appTrademark, journalTrademark, searchType, charCount) => {
  if (!appTrademark || !journalTrademark) return false;

  appTrademark = appTrademark.toLowerCase();
  journalTrademark = journalTrademark.toLowerCase();

  switch (searchType) {
    case "prefix":
      return journalTrademark.startsWith(
        appTrademark.substring(0, charCount)
      );

    case "suffix":
      return journalTrademark.endsWith(
        appTrademark.slice(-charCount)
      );

    case "contains":
      return journalTrademark.includes(appTrademark);

    case "equal":
    default:
      return appTrademark === journalTrademark;
  }
};

/* ================= CONTROLLER ================= */
exports.compareJournal = async (req, res) => {
  try {
    const {
      journalNumber,
      searchType = "equal",
      charCount,
      clientId,
      compareClass = false
    } = req.body;

    /* ================= FETCH JOURNALS ================= */

    const journalDocs = await MonthlyJournal.find(
      journalNumber ? { journalNumber } : {}
    ).lean();

    const appJournalDocs = await Journal.find({})
      .populate("application")
      .lean();

    /* ================= NORMALIZE JOURNAL ROWS ================= */

    const allJournalRows = [];

    // Monthly Journal
    for (const j of journalDocs) {
      if (!j.trademark) continue;

      allJournalRows.push({
        trademark: j.trademark,
        class: j.class,
        appNo: j.applicationNumber,
        journalNo: j.journalNumber
      });
    }

    // Application Journal (SAFE)
    for (const journal of appJournalDocs) {
      if (!journal.application) continue;
      if (!Array.isArray(journal.entries)) continue;

      for (const entry of journal.entries) {
        allJournalRows.push({
          trademark: journal.application.trademark,
          class: journal.application.classes?.[0] || null,
          appNo: journal.application.applicationNumber,
          journalNo: entry.jNo || entry.journalNumber
        });
      }
    }

    /* ================= FETCH APPLICATIONS ================= */

    const appQuery =
      clientId && clientId !== "all"
        ? { client: clientId }
        : {};

    const applications = await Application.find(appQuery).lean();

    /* ================= COMPARE ================= */

    const matchedResults = [];

    for (const app of applications) {
      if (!app.trademark) continue;

      for (const jRow of allJournalRows) {
        const isMatch = matchString(
          app.trademark,
          jRow.trademark,
          searchType,
          charCount
        );

        if (!isMatch) continue;

        if (compareClass && app.classes?.[0] !== jRow.class) continue;

        matchedResults.push({
          customerTrademark: app.trademark,
          customerClass: app.classes || [],
          client: app.client,
          journalTrademark: jRow.trademark,
          journalClass: jRow.class,
          journalNumber: jRow.journalNo,
          applicationNo: jRow.appNo
        });
      }
    }

    /* ================= RESPONSE ================= */

    return res.status(200).json({
      success: true,
      totalMatches: matchedResults.length,
      results: matchedResults
    });

  } catch (err) {
    console.error("COMPARE JOURNAL ERROR:", err);

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message
    });
  }
};
