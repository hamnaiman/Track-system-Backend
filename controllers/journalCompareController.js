const Application = require("../models/applicationModel");
const Journal = require("../models/journalModel");
const MonthlyJournal = require("../models/monthlyJournalModel");

// Helper for comparison logic
const matchString = (appTrademark, journalTrademark, searchType, charCount) => {
  appTrademark = appTrademark.toLowerCase();
  journalTrademark = journalTrademark.toLowerCase();

  switch (searchType) {
    case "prefix":
      return journalTrademark.startsWith(appTrademark.substring(0, charCount));

    case "suffix":
      return journalTrademark.endsWith(appTrademark.slice(-charCount));

    case "contains":
      return journalTrademark.includes(appTrademark);

    case "equal":
    default:
      return appTrademark === journalTrademark;
  }
};

exports.compareJournal = async (req, res) => {
  try {
    const { journalNumber, searchType, charCount, clientId, compareClass } = req.body;

    // Fetch all journal entries (monthly + application)
    const journalDocs = await MonthlyJournal.find(journalNumber ? { journalNumber } : {});
    const appJournalDocs = await Journal.find({}).populate("application");

    // Combine rows
    let allJournalRows = [];

    // Monthly journal rows
    journalDocs.forEach(j => {
      allJournalRows.push({
        trademark: j.trademark,
        class: j.class,
        appNo: j.applicationNumber,
        journalNo: j.journalNumber
      });
    });

    // Application Journal rows
    appJournalDocs.forEach(journal => {
      journal.entries.forEach(entry => {
        allJournalRows.push({
          trademark: journal.application.trademark,
          class: journal.application.classes[0] || null,
          appNo: journal.application.applicationNumber,
          journalNo: entry.jNo || entry.journalNumber
        });
      });
    });

    // Get all customer trademarks
    const appQuery = clientId !== "all" ? { client: clientId } : {};
    const applications = await Application.find(appQuery);

    let matchedResults = [];

    // Compare
    applications.forEach(app => {
      allJournalRows.forEach(jRow => {
        let isMatch = matchString(
          app.trademark,
          jRow.trademark,
          searchType,
          charCount
        );

        if (isMatch) {
          if (compareClass && app.classes[0] !== jRow.class) return;

          matchedResults.push({
            customerTrademark: app.trademark,
            customerClass: app.classes,
            client: app.client,
            journalTrademark: jRow.trademark,
            journalClass: jRow.class,
            journalNumber: jRow.journalNo,
            applicationNo: jRow.appNo
          });
        }
      });
    });

    res.status(200).json({
      success: true,
      totalMatches: matchedResults.length,
      results: matchedResults
    });

  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message
    });
  }
};
